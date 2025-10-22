'use server';

import { db } from '@/db/db';
import { user } from '@/db/schema';
import { and, desc, eq, ilike, isNotNull } from 'drizzle-orm';

export interface SearchFilters {
    bloodGroup?: string;
    wilaya?: string;
    commune?: string;
    donationType?: string;
    emergencyOnly?: boolean;
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


        // Apply filters - only add conditions for non-empty values
        if (filters.bloodGroup && filters.bloodGroup.trim() !== '') {
            conditions.push(eq(user.bloodGroup, filters.bloodGroup));
        }

        if (filters.wilaya && filters.wilaya.trim() !== '') {
            conditions.push(ilike(user.wilaya, `%${filters.wilaya}%`));
        }

        if (filters.commune && filters.commune.trim() !== '') {
            conditions.push(ilike(user.commune, `%${filters.commune}%`));
        }

        if (filters.donationType && filters.donationType.trim() !== '') {
            conditions.push(eq(user.donationType, filters.donationType));
        }

        // Filter for emergency available donors only if requested
        if (filters.emergencyOnly) {
            conditions.push(eq(user.emergencyAvailable, true));
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
            .orderBy(desc(user.emergencyAvailable), desc(user.createdAt));

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
