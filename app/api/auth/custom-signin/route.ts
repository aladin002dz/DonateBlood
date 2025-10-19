import { db } from '@/db/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { identifier, password } = await request.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: 'Identifier and password are required' }, { status: 400 });
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
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const userRecord = foundUser[0];

        // Check if user has an email (required for Better Auth)
        if (!userRecord.email) {
            return NextResponse.json({ error: 'User account is missing email address' }, { status: 401 });
        }

        // Use Better Auth to authenticate the user directly
        // This will handle password verification using Better Auth's built-in mechanism (scrypt)
        const sessionResult = await auth.api.signInEmail({
            body: {
                email: userRecord.email,
                password: password,
            },
            headers: request.headers
        });

        if (!sessionResult) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return success response
        return NextResponse.json({
            success: true,
            user: userRecord,
            redirect: '/profile'
        });
    } catch (error) {
        console.error('Error in custom sign-in:', error);

        // Check if it's a Better Auth error
        if (error && typeof error === 'object' && 'message' in error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
}