
import { db } from '@/db/db';
import WelcomeVerificationEmail from '@/lib/email/WelcomeVerificationEmail';
import { resend } from '@/lib/resend-client';
import {
    betterAuth
} from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Allow unverified emails for phone users
        sendResetPassword: async ({ user, url }) => {
            try {
                await resend.emails.send({
                    from: `"Mahfoudh" <${process.env.EMAIL_FROM}>`,
                    to: user.email,
                    subject: "Reset your password - Donate Blood Platform",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Password Reset Request</h2>
                            <p>Hello ${user.name || user.email},</p>
                            <p>You requested to reset your password. Click the link below to reset your password:</p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                            <p>If you didn't request this password reset, please ignore this email.</p>
                            <p>This link will expire in 1 hour.</p>
                        </div>
                    `
                })
            } catch (error) {
                console.error("Failed to send password reset email:", error)
                throw error
            }
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },
    plugins: [nextCookies()],

    emailVerification: {
        sendOnSignUp: true, // Auto-send verification email on signup
        autoSignInAfterVerification: true, // Auto sign-in after verification
        sendVerificationEmail: async ({ user, url }) => {
            try {
                await resend.emails.send({
                    from: `"Mahfoudh" <${process.env.EMAIL_FROM}>`,
                    to: user.email,
                    subject: "Verify your email address - Donate Blood Platform",
                    react: WelcomeVerificationEmail({
                        userName: user.name || user.email,
                        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}${url}`
                    })
                })
            } catch (error) {
                console.error("Failed to send verification email:", error)
                throw error
            }
        },
    },
    // Email configuration
    email: {
        sendOnSignUp: true, // Auto-send verification email on signup
    }
});
