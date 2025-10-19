import { db } from '@/db/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user profile data from database
        const userProfile = await db.select()
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1);

        if (userProfile.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const profile = userProfile[0];

        return NextResponse.json({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            emailVerified: profile.emailVerified,
            phoneVerified: profile.phoneVerified,
            bloodGroup: profile.bloodGroup,
            wilaya: profile.wilaya,
            commune: profile.commune,
            lastDonation: profile.lastDonation,
            donationType: profile.donationType,
            emergencyAvailable: profile.emergencyAvailable,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            phone,
            email,
            bloodGroup,
            wilaya,
            commune,
            lastDonation,
            donationType,
            emergencyAvailable
        } = body;

        // Update user profile data
        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
        if (wilaya !== undefined) updateData.wilaya = wilaya;
        if (commune !== undefined) updateData.commune = commune;
        if (lastDonation !== undefined) updateData.lastDonation = lastDonation;
        if (donationType !== undefined) updateData.donationType = donationType;
        if (emergencyAvailable !== undefined) updateData.emergencyAvailable = emergencyAvailable;

        await db.update(user)
            .set(updateData)
            .where(eq(user.id, session.user.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
