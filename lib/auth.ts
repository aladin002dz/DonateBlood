
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
        enabled: true
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
                    from: `"MaroStudio" <${process.env.EMAIL_FROM}>`,
                    to: user.email,
                    subject: "Verify your email address",
                    react: WelcomeVerificationEmail({
                        userName: user.name || user.email,
                        verificationUrl: url
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
