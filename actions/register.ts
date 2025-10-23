"use server";

import { db } from '@/db/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    bloodGroup: z.string().min(1, 'Blood group is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    wilaya: z.string().min(1, 'Wilaya is required'),
    commune: z.string().min(1, 'Commune is required'),
    lastDonation: z.string().optional(),
    donationType: z.string().min(1, 'Donation type is required'),
    emergencyAvailable: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation - accepts international format and local format starting with 0
    const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{9,14})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export async function registerUser(formData: FormData) {
    try {
        // Extract form data
        const rawData = {
            fullName: formData.get('fullName') as string,
            bloodGroup: formData.get('bloodGroup') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
            phone: formData.get('phone') as string,
            wilaya: formData.get('wilaya') as string,
            commune: formData.get('commune') as string,
            lastDonation: formData.get('lastDonation') as string,
            donationType: formData.get('donationType') as string,
            emergencyAvailable: formData.get('emergencyAvailable') === 'on',
        };

        // Validate phone number
        if (!validatePhoneNumber(rawData.phone)) {
            return {
                success: false,
                error: 'Please enter a valid phone number (e.g., +1234567890)',
            };
        }

        // Validate form data
        const validatedData = registerSchema.parse(rawData);

        // Check if user already exists
        const existingUser = await db.select()
            .from(user)
            .where(eq(user.email, validatedData.email))
            .limit(1);

        if (existingUser.length > 0) {
            return {
                success: false,
                error: 'User with this email already exists',
            };
        }

        // Check if phone number already exists
        const existingPhone = await db.select()
            .from(user)
            .where(eq(user.phone, validatedData.phone))
            .limit(1);

        if (existingPhone.length > 0) {
            return {
                success: false,
                error: 'User with this phone number already exists',
            };
        }

        // Create user account with better-auth
        const signUpResult = await auth.api.signUpEmail({
            body: {
                email: validatedData.email,
                password: validatedData.password,
                name: validatedData.fullName,
            },
        });

        if (!signUpResult) {
            return {
                success: false,
                error: 'Failed to create user account',
            };
        }

        // Update user with additional information immediately after creation
        await db.update(user)
            .set({
                phone: validatedData.phone,
                bloodGroup: validatedData.bloodGroup,
                wilaya: validatedData.wilaya,
                commune: validatedData.commune,
                lastDonation: validatedData.lastDonation || null,
                donationType: validatedData.donationType,
                emergencyAvailable: validatedData.emergencyAvailable,
            })
            .where(eq(user.id, signUpResult.user.id));

        // Verify that the phone field was set correctly
        if (!validatedData.phone) {
            return {
                success: false,
                error: 'Phone number is required',
            };
        }

        // Return success - redirect to verification page since email verification is required
        return {
            success: true,
            redirectTo: '/profile'
        };

    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || 'Validation error',
            };
        }

        return {
            success: false,
            error: 'An error occurred during registration. Please try again.',
        };
    }
}
