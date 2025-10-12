import { getMigrationStats, getUsersNeedingPhoneUpdate } from '@/scripts/migration-utils';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const stats = await getMigrationStats();
        const usersNeedingUpdate = await getUsersNeedingPhoneUpdate();

        return NextResponse.json({
            stats,
            usersNeedingUpdate,
            message: 'Migration statistics retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting migration stats:', error);
        return NextResponse.json(
            { error: 'Failed to get migration statistics' },
            { status: 500 }
        );
    }
}
