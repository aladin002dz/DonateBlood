'use server';

import { db } from '@/db/db';
import { user } from '@/db/schema';
import wilayasDataAr from '@/i18n/dictionnaries/wilayas-dairas-commune_ar.json';
import wilayasDataEn from '@/i18n/dictionnaries/wilayas-dairas-commune_en.json';
import { and, desc, eq, ilike, isNotNull, or } from 'drizzle-orm';

export interface SearchFilters {
    bloodGroup?: string;
    wilaya?: string;
    daira?: string;
    commune?: string;
    donationType?: string;
    emergencyOnly?: boolean;
}

export interface DonorData {
    id: string;
    name: string;
    bloodGroup: string | null;
    wilaya: string | null;
    daira: string | null;
    commune: string | null;
    donationType: string | null;
    phone: string | null;
    lastDonation: string | null;
    emergencyAvailable: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
}

type LocationData = {
    code: string;
    name: string;
    dairas: {
        [dairaName: string]: string[];
    };
};

/**
 * Find all translations of a wilaya name across all languages
 */
function getAllWilayaTranslations(searchName: string): string[] {
    const translations = new Set<string>();

    const enWilayas = wilayasDataEn as unknown as LocationData[];
    const arWilayas = wilayasDataAr as unknown as LocationData[];

    // Search in English data
    for (const wilaya of enWilayas) {
        if (wilaya.name.toLowerCase().includes(searchName.toLowerCase()) ||
            searchName.toLowerCase().includes(wilaya.name.toLowerCase())) {
            translations.add(wilaya.name);
            // Find corresponding Arabic translation
            const arWilaya = arWilayas.find(w => w.code === wilaya.code);
            if (arWilaya) {
                translations.add(arWilaya.name);
            }
        }
    }

    // Search in Arabic data
    for (const wilaya of arWilayas) {
        if (wilaya.name.includes(searchName) || searchName.includes(wilaya.name)) {
            translations.add(wilaya.name);
            // Find corresponding English translation
            const enWilaya = enWilayas.find(w => w.code === wilaya.code);
            if (enWilaya) {
                translations.add(enWilaya.name);
            }
        }
    }

    return Array.from(translations);
}

/**
 * Find all translations of a daira name for a specific wilaya
 */
function getAllDairaTranslations(searchName: string, wilayaCode?: string): string[] {
    const translations = new Set<string>();

    const enWilayas = wilayasDataEn as unknown as LocationData[];
    const arWilayas = wilayasDataAr as unknown as LocationData[];

    // Search in English data
    for (const enWilaya of enWilayas) {
        if (wilayaCode && enWilaya.code !== wilayaCode) continue;

        for (const [dairaName] of Object.entries(enWilaya.dairas)) {
            if (dairaName.toLowerCase().includes(searchName.toLowerCase()) ||
                searchName.toLowerCase().includes(dairaName.toLowerCase())) {
                translations.add(dairaName);

                // Find corresponding Arabic wilaya
                const arWilaya = arWilayas.find(w => w.code === enWilaya.code);
                if (arWilaya) {
                    // Get all dairas from both languages
                    const enDairas = Object.keys(enWilaya.dairas);
                    const arDairas = Object.keys(arWilaya.dairas);
                    const dairaIndex = enDairas.indexOf(dairaName);

                    // Add corresponding Arabic daira at same index
                    if (dairaIndex >= 0 && dairaIndex < arDairas.length) {
                        translations.add(arDairas[dairaIndex]);
                    }
                }
            }
        }
    }

    // Search in Arabic data
    for (const arWilaya of arWilayas) {
        if (wilayaCode && arWilaya.code !== wilayaCode) continue;

        for (const [dairaName] of Object.entries(arWilaya.dairas)) {
            if (dairaName.includes(searchName) || searchName.includes(dairaName)) {
                translations.add(dairaName);

                // Find corresponding English wilaya
                const enWilaya = enWilayas.find(w => w.code === arWilaya.code);
                if (enWilaya) {
                    // Get all dairas from both languages
                    const arDairas = Object.keys(arWilaya.dairas);
                    const enDairas = Object.keys(enWilaya.dairas);
                    const dairaIndex = arDairas.indexOf(dairaName);

                    // Add corresponding English daira at same index
                    if (dairaIndex >= 0 && dairaIndex < enDairas.length) {
                        translations.add(enDairas[dairaIndex]);
                    }
                }
            }
        }
    }

    return Array.from(translations);
}

/**
 * Find all translations of a commune name
 */
function getAllCommuneTranslations(searchName: string, wilayaCode?: string, dairaName?: string): string[] {
    const translations = new Set<string>();

    const enWilayas = wilayasDataEn as unknown as LocationData[];
    const arWilayas = wilayasDataAr as unknown as LocationData[];

    // Search in English data
    for (const enWilaya of enWilayas) {
        if (wilayaCode && enWilaya.code !== wilayaCode) continue;

        for (const [enDairaName, enCommunes] of Object.entries(enWilaya.dairas)) {
            // If daira filter is provided, check if this daira matches
            if (dairaName && !enDairaName.toLowerCase().includes(dairaName.toLowerCase()) &&
                !dairaName.toLowerCase().includes(enDairaName.toLowerCase())) {
                continue;
            }

            for (const commune of enCommunes) {
                if (commune.toLowerCase().includes(searchName.toLowerCase()) ||
                    searchName.toLowerCase().includes(commune.toLowerCase())) {
                    translations.add(commune);

                    // Find corresponding Arabic wilaya and daira
                    const arWilaya = arWilayas.find(w => w.code === enWilaya.code);
                    if (arWilaya) {
                        // Find matching daira by index
                        const enDairas = Object.keys(enWilaya.dairas);
                        const arDairas = Object.keys(arWilaya.dairas);
                        const dairaIndex = enDairas.indexOf(enDairaName);

                        if (dairaIndex >= 0 && dairaIndex < arDairas.length) {
                            const arDairaName = arDairas[dairaIndex];
                            const arCommunes = arWilaya.dairas[arDairaName];

                            // Add commune at same index
                            const communeIndex = enCommunes.indexOf(commune);
                            if (communeIndex >= 0 && communeIndex < arCommunes.length) {
                                translations.add(arCommunes[communeIndex]);
                            }
                        }
                    }
                }
            }
        }
    }

    // Search in Arabic data
    for (const arWilaya of arWilayas) {
        if (wilayaCode && arWilaya.code !== wilayaCode) continue;

        for (const [arDairaName, arCommunes] of Object.entries(arWilaya.dairas)) {
            if (dairaName && !arDairaName.includes(dairaName) && !dairaName.includes(arDairaName)) {
                continue;
            }

            for (const commune of arCommunes) {
                if (commune.includes(searchName) || searchName.includes(commune)) {
                    translations.add(commune);

                    // Find corresponding English wilaya and daira
                    const enWilaya = enWilayas.find(w => w.code === arWilaya.code);
                    if (enWilaya) {
                        // Find matching daira by index
                        const arDairas = Object.keys(arWilaya.dairas);
                        const enDairas = Object.keys(enWilaya.dairas);
                        const dairaIndex = arDairas.indexOf(arDairaName);

                        if (dairaIndex >= 0 && dairaIndex < enDairas.length) {
                            const enDairaName = enDairas[dairaIndex];
                            const enCommunes = enWilaya.dairas[enDairaName];

                            // Add commune at same index
                            const communeIndex = arCommunes.indexOf(commune);
                            if (communeIndex >= 0 && communeIndex < enCommunes.length) {
                                translations.add(enCommunes[communeIndex]);
                            }
                        }
                    }
                }
            }
        }
    }

    return Array.from(translations);
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

        // Find wilaya code for daira and commune translation lookup
        let wilayaCode: string | undefined;
        if (filters.wilaya && filters.wilaya.trim() !== '') {
            // Find wilaya code from the search term
            const enWilayas = wilayasDataEn as unknown as LocationData[];
            const arWilayas = wilayasDataAr as unknown as LocationData[];
            const allWilayas = [...enWilayas, ...arWilayas];
            const foundWilaya = allWilayas.find(w =>
                w.name.toLowerCase().includes(filters.wilaya!.toLowerCase()) ||
                filters.wilaya!.toLowerCase().includes(w.name.toLowerCase())
            );
            wilayaCode = foundWilaya?.code;

            // Get all translations of the wilaya
            const wilayaTranslations = getAllWilayaTranslations(filters.wilaya);

            if (wilayaTranslations.length > 0) {
                // Create OR condition for all translations
                if (wilayaTranslations.length === 1) {
                    conditions.push(ilike(user.wilaya, `%${wilayaTranslations[0]}%`));
                } else {
                    const wilayaConditions = wilayaTranslations.map(translation =>
                        ilike(user.wilaya, `%${translation}%`)
                    );
                    conditions.push(or(...wilayaConditions)!);
                }
            } else {
                // Fallback to original search if no translations found
                conditions.push(ilike(user.wilaya, `%${filters.wilaya}%`));
            }
        }

        if (filters.daira && filters.daira.trim() !== '') {
            // Get all translations of the daira
            const dairaTranslations = getAllDairaTranslations(filters.daira, wilayaCode);

            // Always use OR with the original search term and all translations
            const allDairaTerms = [filters.daira, ...dairaTranslations];
            const uniqueDairaTerms = Array.from(new Set(allDairaTerms));

            if (uniqueDairaTerms.length === 1) {
                conditions.push(ilike(user.daira, `%${uniqueDairaTerms[0]}%`));
            } else {
                const dairaConditions = uniqueDairaTerms.map(term =>
                    ilike(user.daira, `%${term}%`)
                );
                conditions.push(or(...dairaConditions)!);
            }
        }

        if (filters.commune && filters.commune.trim() !== '') {
            // Find daira name for commune translation lookup
            let dairaName: string | undefined;
            if (filters.daira && filters.daira.trim() !== '') {
                // Try to find the daira name from translations
                const dairaTranslations = getAllDairaTranslations(filters.daira, wilayaCode);
                dairaName = dairaTranslations[0]; // Use first translation as reference
            }

            // Get all translations of the commune
            const communeTranslations = getAllCommuneTranslations(filters.commune, wilayaCode, dairaName);

            // Always use OR with the original search term and all translations
            const allCommuneTerms = [filters.commune, ...communeTranslations];
            const uniqueCommuneTerms = Array.from(new Set(allCommuneTerms));

            if (uniqueCommuneTerms.length === 1) {
                conditions.push(ilike(user.commune, `%${uniqueCommuneTerms[0]}%`));
            } else {
                const communeConditions = uniqueCommuneTerms.map(term =>
                    ilike(user.commune, `%${term}%`)
                );
                conditions.push(or(...communeConditions)!);
            }
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
                daira: user.daira,
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
