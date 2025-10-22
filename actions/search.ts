'use server';

import { db } from '@/db/db';
import { user } from '@/db/schema';
import { and, eq, ilike, isNotNull, or } from 'drizzle-orm';

export interface SearchFilters {
    bloodGroup?: string;
    wilaya?: string;
    commune?: string;
    donationType?: string;
}

export interface DonorData {
    id: string;
    name: string;
    bloodGroup: string | null;
    wilaya: string | null;
    commune: string | null;
    donationType: string | null;
    phone: string | null;
    lastDonation: string | null;
    emergencyAvailable: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
}

export async function searchDonors(filters: SearchFilters = {}) {
    try {
        // Build the query conditions
        const conditions = [];

        // Only show users who have completed their profile (have blood group and location)
        conditions.push(isNotNull(user.bloodGroup));
        conditions.push(isNotNull(user.wilaya));
        conditions.push(isNotNull(user.commune));

        // Only show verified users (email or phone verified)
        conditions.push(or(
            eq(user.emailVerified, true),
            eq(user.phoneVerified, true)
        ));

        // Apply filters
        if (filters.bloodGroup) {
            conditions.push(eq(user.bloodGroup, filters.bloodGroup));
        }

        if (filters.wilaya) {
            conditions.push(ilike(user.wilaya, `%${filters.wilaya}%`));
        }

        if (filters.commune) {
            conditions.push(ilike(user.commune, `%${filters.commune}%`));
        }

        if (filters.donationType) {
            conditions.push(eq(user.donationType, filters.donationType));
        }

        // Fetch donors from database
        const donors = await db
            .select({
                id: user.id,
                name: user.name,
                bloodGroup: user.bloodGroup,
                wilaya: user.wilaya,
                commune: user.commune,
                donationType: user.donationType,
                phone: user.phone,
                lastDonation: user.lastDonation,
                emergencyAvailable: user.emergencyAvailable,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified,
            })
            .from(user)
            .where(and(...conditions))
            .orderBy(user.createdAt);

        return {
            success: true,
            data: donors as DonorData[]
        };
    } catch (error) {
        console.error('Error searching donors:', error);
        return {
            success: false,
            error: 'Failed to search donors'
        };
    }
}
