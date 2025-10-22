"use server";

import { db } from '@/db/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    bloodGroup: z.string().min(1, 'Blood group is required').optional(),
    wilaya: z.string().min(1, 'Wilaya is required').optional(),
    commune: z.string().min(1, 'Commune is required').optional(),
    lastDonation: z.string().optional(),
    donationType: z.string().min(1, 'Donation type is required').optional(),
    emergencyAvailable: z.boolean().optional(),
});

const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation - accepts international format and local format starting with 0
    const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{9,14})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export async function getProfile() {
    try {
        const session = await auth.api.getSession({
            headers: await import('next/headers').then(h => h.headers())
        });

        if (!session) {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        // Fetch user profile data from database
        const userProfile = await db.select()
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1);

        if (userProfile.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        const profile = userProfile[0];

        return {
            success: true,
            data: {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                emailVerified: profile.emailVerified,
                phoneVerified: profile.phoneVerified,
                bloodGroup: profile.bloodGroup,
                wilaya: profile.wilaya,
                commune: profile.commune,
                lastDonation: profile.lastDonation,
                donationType: profile.donationType,
                emergencyAvailable: profile.emergencyAvailable,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            }
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await import('next/headers').then(h => h.headers())
        });

        if (!session) {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }

        // Extract form data
        const rawData = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            bloodGroup: formData.get('bloodGroup') as string,
            wilaya: formData.get('wilaya') as string,
            commune: formData.get('commune') as string,
            lastDonation: formData.get('lastDonation') as string,
            donationType: formData.get('donationType') as string,
            emergencyAvailable: formData.get('emergencyAvailable') === 'on',
        };

        // Filter out empty values
        const filteredData = Object.fromEntries(
            Object.entries(rawData).filter(([, value]) => value !== null && value !== undefined && value !== '')
        ) as Partial<typeof rawData>;

        // Validate phone number if provided
        if (filteredData.phone && !validatePhoneNumber(filteredData.phone)) {
            return {
                success: false,
                error: 'Please enter a valid phone number (e.g., +1234567890)',
            };
        }

        // Validate form data
        const validatedData = updateProfileSchema.parse(filteredData);

        // Check if email is being changed and if it already exists
        if (validatedData.email) {
            const existingUser = await db.select()
                .from(user)
                .where(eq(user.email, validatedData.email))
                .limit(1);

            if (existingUser.length > 0 && existingUser[0].id !== session.user.id) {
                return {
                    success: false,
                    error: 'User with this email already exists',
                };
            }
        }

        // Check if phone is being changed and if it already exists
        if (validatedData.phone) {
            const existingPhone = await db.select()
                .from(user)
                .where(eq(user.phone, validatedData.phone))
                .limit(1);

            if (existingPhone.length > 0 && existingPhone[0].id !== session.user.id) {
                return {
                    success: false,
                    error: 'User with this phone number already exists',
                };
            }
        }

        // Update user profile data
        const updateData: Partial<typeof user.$inferSelect> = {};

        if (validatedData.name !== undefined) updateData.name = validatedData.name;
        if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
        if (validatedData.email !== undefined) updateData.email = validatedData.email;
        if (validatedData.bloodGroup !== undefined) updateData.bloodGroup = validatedData.bloodGroup;
        if (validatedData.wilaya !== undefined) updateData.wilaya = validatedData.wilaya;
        if (validatedData.commune !== undefined) updateData.commune = validatedData.commune;
        if (validatedData.lastDonation !== undefined) updateData.lastDonation = validatedData.lastDonation;
        if (validatedData.donationType !== undefined) updateData.donationType = validatedData.donationType;
        if (validatedData.emergencyAvailable !== undefined) updateData.emergencyAvailable = validatedData.emergencyAvailable;

        await db.update(user)
            .set(updateData)
            .where(eq(user.id, session.user.id));

        return {
            success: true,
            message: 'Profile updated successfully'
        };
    } catch (error) {
        console.error('Error updating user profile:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || 'Validation error',
            };
        }

        return {
            success: false,
            error: 'Internal server error'
        };
    }
}
