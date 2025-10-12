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

        // Determine if identifier is email or phone
        // Use better-auth to sign in with the appropriate method
        let session;
        if (userRecord.email && identifier === userRecord.email) {
            // Sign in with email
            session = await auth.api.signInEmail({
                body: {
                    email: userRecord.email,
                    password: password,
                },
                headers: request.headers
            });
        } else if (userRecord.email) {
            // User signed in with phone but has email, use email for auth
            session = await auth.api.signInEmail({
                body: {
                    email: userRecord.email,
                    password: password,
                },
                headers: request.headers
            });
        } else {
            // No email available, cannot authenticate
            return NextResponse.json({ error: 'Cannot authenticate user without email' }, { status: 401 });
        }

        if (session.error) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({ success: true, user: userRecord });
    } catch (error) {
        console.error('Error in custom sign-in:', error);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
}
