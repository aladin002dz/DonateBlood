'use server';

import { db } from '@/db/db';
import { account, session as sessionTable, user, verification } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function deleteAccount() {
    try {
        // Get the current session
        const currentSession = await auth.api.getSession({
            headers: await headers()
        });

        if (!currentSession) {
            return {
                success: false,
                error: 'Unauthorized - please sign in to delete your account'
            };
        }

        const userId = currentSession.user.id;

        // Verify the user exists
        const userRecord = await db.select()
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (userRecord.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Delete all related data in the correct order to respect foreign key constraints
        // 1. Delete sessions (they reference user.id)
        await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

        // 2. Delete accounts (they reference user.id)
        await db.delete(account).where(eq(account.userId, userId));

        // 3. Delete verification records (they might reference user email/phone)
        const userData = userRecord[0];
        if (userData.email) {
            await db.delete(verification).where(eq(verification.identifier, userData.email));
        }
        if (userData.phone) {
            await db.delete(verification).where(eq(verification.identifier, userData.phone));
        }

        // 4. Finally delete the user record
        await db.delete(user).where(eq(user.id, userId));

        // Sign out the user after successful deletion
        await auth.api.signOut({
            headers: await headers()
        });

        return {
            success: true,
            message: 'Account deleted successfully'
        };

    } catch (error) {
        console.error('Error deleting account:', error);
        return {
            success: false,
            error: 'Failed to delete account. Please try again or contact support.'
        };
    }
}
