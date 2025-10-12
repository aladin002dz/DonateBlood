import { db } from '@/db/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone, email } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // Update user phone number and email
        const updateData: { phone: string; email?: string | null } = { phone };
        if (email !== undefined) {
            updateData.email = email;
        }

        await db.update(user)
            .set(updateData)
            .where(eq(user.id, session.user.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user phone:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
