'use server';

import { db } from '@/db/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, or } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function customSignIn(identifier: string, password: string) {
    try {
        if (!identifier || !password) {
            return { error: 'Identifier and password are required' };
        }

        // Find user by email or phone
        const foundUser = await db.select()
            .from(user)
            .where(or(
                eq(user.email, identifier),
                eq(user.phone, identifier)
            ))
            .limit(1);

        if (foundUser.length === 0) {
            return { error: 'User not found' };
        }

        const userRecord = foundUser[0];

        // Check if user has an email (required for Better Auth)
        if (!userRecord.email) {
            return { error: 'User account is missing email address' };
        }

        // Use Better Auth to authenticate the user directly
        // This will handle password verification using Better Auth's built-in mechanism (scrypt)
        const sessionResult = await auth.api.signInEmail({
            body: {
                email: userRecord.email,
                password: password,
            },
            headers: await headers()
        });

        if (!sessionResult) {
            return { error: 'Incorrect password' };
        }

        // Return success response
        return {
            success: true,
            user: userRecord,
            redirect: '/profile'
        };
    } catch (error) {
        console.error('Error in custom sign-in:', error);

        // Check if it's a Better Auth error
        if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = error.message as string;
            // Check if it's a password-related error
            return { error: errorMessage };
        }

        return { error: 'An error occurred during sign-in' };
    }
}
