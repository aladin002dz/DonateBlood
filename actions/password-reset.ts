'use server'

import { sendPasswordResetEmail } from '@/actions/email';
import { db } from '@/db/db';
import { account, user, verification } from '@/db/schema';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { and, eq } from 'drizzle-orm';

export async function requestPasswordReset(email: string) {
    try {
        // Check if user exists
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1);

        if (existingUser.length === 0) {
            return {
                success: false,
                error: 'No account found with this email address'
            };
        }

        // Generate a secure token
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Store the reset token in the verification table with user email as identifier
        await db.insert(verification).values({
            id: randomBytes(16).toString('hex'),
            identifier: 'password-reset',
            value: `${email}:${token}`, // Store email with token for user identification
            expiresAt,
        });

        // Send password reset email
        await sendPasswordResetEmail(email, token);

        return {
            success: true,
            message: 'Password reset email sent successfully'
        };
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return {
            success: false,
            error: 'Failed to send password reset email'
        };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        // Find the reset token
        const resetTokens = await db
            .select()
            .from(verification)
            .where(eq(verification.identifier, 'password-reset'));

        // Find the token that matches
        const resetToken = resetTokens.find(t => t.value.endsWith(`:${token}`));

        if (!resetToken) {
            return {
                success: false,
                error: 'Invalid or expired reset token'
            };
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            // Clean up expired token
            await db
                .delete(verification)
                .where(eq(verification.id, resetToken.id));

            return {
                success: false,
                error: 'Reset token has expired'
            };
        }

        // Extract email from the stored value
        const email = resetToken.value.split(':')[0];

        // Find the user
        const userResult = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1);

        if (userResult.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        const userId = userResult[0].id;

        // Hash the new password
        const hashedPassword = await hash(newPassword, 12);

        // Update the user's password in the account table
        await db
            .update(account)
            .set({
                password: hashedPassword,
                updatedAt: new Date()
            })
            .where(and(
                eq(account.userId, userId),
                eq(account.providerId, 'credential')
            ));

        // Clean up the reset token
        await db
            .delete(verification)
            .where(eq(verification.id, resetToken.id));

        return {
            success: true,
            message: 'Password reset successfully'
        };
    } catch (error) {
        console.error('Error resetting password:', error);
        return {
            success: false,
            error: 'Failed to reset password'
        };
    }
}

export async function validateResetToken(token: string) {
    try {
        const resetTokens = await db
            .select()
            .from(verification)
            .where(eq(verification.identifier, 'password-reset'));

        // Find the token that matches
        const resetToken = resetTokens.find(t => t.value.endsWith(`:${token}`));

        if (!resetToken) {
            return {
                valid: false,
                error: 'Invalid reset token'
            };
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            // Clean up expired token
            await db
                .delete(verification)
                .where(eq(verification.id, resetToken.id));

            return {
                valid: false,
                error: 'Reset token has expired'
            };
        }

        return {
            valid: true,
            message: 'Token is valid'
        };
    } catch (error) {
        console.error('Error validating reset token:', error);
        return {
            valid: false,
            error: 'Failed to validate reset token'
        };
    }
}
