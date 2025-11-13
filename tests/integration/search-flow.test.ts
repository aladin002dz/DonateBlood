import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchDonors } from '@/actions/search';
import { db } from '@/db/db';
import { createTestDonor, createTestDonors } from '@/tests/factories/donor.factory';

// Mock dependencies
vi.mock('@/db/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock('@/i18n/dictionnaries/wilayas-dairas-commune_en.json', () => ({
  default: [
    {
      code: '01',
      name: 'Adrar',
      dairas: {
        'Adrar': ['Adrar', 'Tamest'],
      },
    },
  ],
}));

vi.mock('@/i18n/dictionnaries/wilayas-dairas-commune_ar.json', () => ({
  default: [
    {
      code: '01',
      name: 'أدرار',
      dairas: {
        'أدرار': ['أدرار', 'تمست'],
      },
    },
  ],
}));

describe('Search Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search and filter donors by multiple criteria', async () => {
    const mockDonors = createTestDonors(5, {
      bloodGroup: 'O+',
      wilaya: 'Adrar',
      emergencyAvailable: true,
    });
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await searchDonors({
      bloodGroup: 'O+',
      wilaya: 'Adrar',
      emergencyOnly: true,
    });
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(5);
    expect(result.data?.every(donor => donor.bloodGroup === 'O+')).toBe(true);
    expect(result.data?.every(donor => donor.emergencyAvailable)).toBe(true);
  });

  it('should handle search with no results', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await searchDonors({
      bloodGroup: 'AB-',
    });
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should search donors with location translation support', async () => {
    const mockDonors = [createTestDonor({ wilaya: 'Adrar' })];
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    // Search with English name
    const resultEn = await searchDonors({ wilaya: 'Adrar' });
    expect(resultEn.success).toBe(true);
    
    // Search with Arabic name should also work (handled by translation logic)
    const resultAr = await searchDonors({ wilaya: 'أدرار' });
    expect(resultAr.success).toBe(true);
  });
});

