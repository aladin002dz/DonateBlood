"use server";

import { db } from '@/db/db';
import { donor, report, user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { and, eq, gt, ne, or, sql, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

const reportDonorSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    reason: z
        .string()
        .trim()
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason must be at most 500 characters'),
});

const updateDonorStatusSchema = z.object({
    donorId: z.string().min(1, 'Donor ID is required'),
    newStatus: z.enum(['active', 'hidden', 'banned']),
});

/**
 * Helper function to get the current session.
 * Throws an error if the user is not authenticated.
 */
async function getAuthenticatedSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error('Unauthorized');
    }

    return session;
}

/**
 * Generate a unique ID for new records.
 */
function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Report a donor with a specific reason.
 * - Checks if a donor record exists for the given user ID.
 * - If not, creates a new donor record.
 * - Inserts a record into the `report` table.
 * - Increments `reportCount` on the donor.
 * - If `reportCount` reaches 3, automatically updates the donor's `status` to 'hidden'.
 */
export async function reportDonor(userId: string, reason: string) {
    try {
        const session = await getAuthenticatedSession();

        // Validate inputs
        const { userId: validatedUserId, reason: validatedReason } = reportDonorSchema.parse({ userId, reason });

        // Prevent users from reporting themselves
        if (validatedUserId === session.user.id) {
            return {
                success: false,
                error: 'You cannot report yourself'
            };
        }

        // Check if the donor exists for this user
        let donorResult = await db.select()
            .from(donor)
            .where(eq(donor.userId, validatedUserId))
            .limit(1);

        let targetDonor;

        if (donorResult.length === 0) {
            // Create a new donor record if it doesn't exist
            const newDonorId = generateId();
            await db.insert(donor).values({
                id: newDonorId,
                userId: validatedUserId,
                status: 'active',
                reportCount: 0,
            });

            targetDonor = {
                id: newDonorId,
                userId: validatedUserId,
                reportCount: 0,
                status: 'active'
            };
        } else {
            targetDonor = donorResult[0];
        }

        // Prevent the same reporter from submitting more than one active report
        // against the same donor (otherwise a single account could reach the
        // 3-report auto-hide threshold on its own).
        const existingReport = await db.select({ id: report.id })
            .from(report)
            .where(and(
                eq(report.reporterId, session.user.id),
                eq(report.donorId, targetDonor.id),
                ne(report.status, 'dismissed')
            ))
            .limit(1);

        if (existingReport.length > 0) {
            return {
                success: false,
                error: 'You have already reported this donor'
            };
        }

        // Insert report record
        await db.insert(report).values({
            id: generateId(),
            reporterId: session.user.id,
            donorId: targetDonor.id,
            reason: validatedReason,
            status: 'pending',
        });

        // Increment reportCount on the donor and update status if needed
        const newReportCount = targetDonor.reportCount + 1;

        let updateData: { reportCount: number; status?: 'active' | 'hidden' | 'banned' } = {
            reportCount: newReportCount
        };

        if (newReportCount >= 3) {
            updateData.status = 'hidden';
        }

        await db.update(donor)
            .set(updateData)
            .where(eq(donor.id, targetDonor.id));


        return {
            success: true,
            message: 'Report submitted successfully'
        };
    } catch (error) {
        console.error('Error reporting donor:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || 'Validation error'
            };
        }

        if (error instanceof Error && error.message === 'Unauthorized') {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Update a donor's status with hierarchy protection.
 * - Admins can change any donor's status.
 * - Moderators can only change status of donors owned by regular users.
 * - Regular users cannot change donor statuses.
 */
export async function updateDonorStatus(donorId: string, newStatus: string) {
    try {
        const session = await getAuthenticatedSession();

        // Validate inputs
        const { donorId: validatedDonorId, newStatus: validatedStatus } = updateDonorStatusSchema.parse({ donorId, newStatus });

        // Get the current user's role
        const currentUserRole = (session.user as { role?: string }).role || 'user';

        // Hierarchy Protection: Users cannot change donor statuses
        if (currentUserRole === 'user') {
            throw new Error('Unauthorized');
        }

        // Fetch the target donor
        const donorResult = await db.select()
            .from(donor)
            .where(eq(donor.id, validatedDonorId))
            .limit(1);

        if (donorResult.length === 0) {
            return {
                success: false,
                error: 'Donor not found'
            };
        }

        const targetDonor = donorResult[0];

        // Fetch the user who owns the donor profile
        const ownerResult = await db.select()
            .from(user)
            .where(eq(user.id, targetDonor.userId))
            .limit(1);

        if (ownerResult.length === 0) {
            return {
                success: false,
                error: 'Donor owner not found'
            };
        }

        const donorOwner = ownerResult[0];
        const donorOwnerRole = donorOwner.role || 'user';

        // Hierarchy Protection for Moderators
        if (currentUserRole === 'moderator') {
            // Moderators can only change status of donors owned by regular users
            if (donorOwnerRole === 'admin' || donorOwnerRole === 'moderator') {
                throw new Error('Moderators cannot ban staff');
            }
        }

        // Admin can change any donor's status - no additional checks needed

        // Update the donor's status
        // Reset reportCount when approving
        const updateData: { status: 'active' | 'hidden' | 'banned'; reportCount?: number } = {
            status: validatedStatus
        };

        if (validatedStatus === 'active') {
            updateData.reportCount = 0;
        }

        await db.update(donor)
            .set(updateData)
            .where(eq(donor.id, validatedDonorId));

        // Revalidate relevant paths
        revalidatePath('/dashboard');
        revalidatePath('/admin');
        revalidatePath('/search');

        return {
            success: true,
            message: `Donor status updated to ${validatedStatus}`
        };
    } catch (error) {
        console.error('Error updating donor status:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || 'Validation error'
            };
        }

        if (error instanceof Error) {
            if (error.message === 'Unauthorized') {
                return {
                    success: false,
                    error: 'Unauthorized'
                };
            }
            if (error.message === 'Moderators cannot ban staff') {
                return {
                    success: false,
                    error: 'Moderators cannot ban staff'
                };
            }
        }

        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Get all flagged donors (hidden status OR reportCount > 0) with owner details.
 * Only accessible by admin or moderator.
 */
export async function getFlaggedDonors() {
    try {
        const session = await getAuthenticatedSession();
        const currentUserRole = (session.user as { role?: string }).role || 'user';

        // Only admin/moderator can access
        if (currentUserRole !== 'admin' && currentUserRole !== 'moderator') {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        // Fetch donors with status 'hidden' OR reportCount > 0
        // Join with user table to get owner details
        const flaggedDonors = await db
            .select({
                id: donor.id,
                userId: donor.userId,
                status: donor.status,
                reportCount: donor.reportCount,
                ownerName: user.name,
                ownerPhone: user.phone,
                ownerRole: user.role,
            })
            .from(donor)
            .innerJoin(user, eq(donor.userId, user.id))
            .where(or(eq(donor.status, 'hidden'), gt(donor.reportCount, 0)));

        return {
            success: true,
            donors: flaggedDonors,
            currentUserRole
        };
    } catch (error) {
        console.error('Error fetching flagged donors:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Get all reports with reporter and donor details.
 * Only accessible by admin or moderator.
 */
export async function getAllReports() {
    try {
        const session = await getAuthenticatedSession();
        const currentUserRole = (session.user as { role?: string }).role || 'user';

        // Only admin/moderator can access
        if (currentUserRole !== 'admin' && currentUserRole !== 'moderator') {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        const reports = await db
            .select({
                id: report.id,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt,
                reporterName: user.name,
                donorId: donor.id,
                donorName: sql<string>`(SELECT name FROM ${user} WHERE ${user.id} = ${donor.userId})`,
            })
            .from(report)
            .innerJoin(user, eq(report.reporterId, user.id))
            .innerJoin(donor, eq(report.donorId, donor.id))
            .orderBy(desc(report.createdAt));

        return {
            success: true,
            reports
        };
    } catch (error) {
        console.error('Error fetching reports:', error);
        return {
            success: false,
            error: 'Failed to fetch reports'
        };
    }
}
