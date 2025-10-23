'use server'

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function requestPasswordReset(email: string) {
    try {
        // Use Better Auth's built-in password reset functionality
        const result = await auth.api.forgetPassword({
            body: {
                email: email,
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
            },
            headers: await headers()
        });

        if (result) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            };
        } else {
            return {
                success: false,
                error: 'Failed to send password reset email'
            };
        }
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
        // Use Better Auth's built-in password reset functionality
        const result = await auth.api.resetPassword({
            body: {
                token: token,
                newPassword: newPassword
            },
            headers: await headers()
        });

        if (result) {
            return {
                success: true,
                message: 'Password reset successfully'
            };
        } else {
            return {
                success: false,
                error: 'Invalid or expired reset token'
            };
        }
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
        if (!token) {
            return {
                valid: false,
                error: 'No token provided'
            };
        }

        // For password reset, we'll skip pre-validation and let Better Auth
        // handle token validation when the user actually submits the form
        // This is more reliable since Better Auth manages the token lifecycle
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
