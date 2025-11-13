import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchDonors, type SearchFilters } from '../search';
import { db } from '@/db/db';
import { createTestDonor } from '@/tests/factories/donor.factory';

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

describe('searchDonors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search donors by blood group', async () => {
    const mockDonors = [createTestDonor({ bloodGroup: 'O+' })];
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const filters: SearchFilters = { bloodGroup: 'O+' };
    const result = await searchDonors(filters);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockDonors);
  });

  it('should search donors by location (wilaya)', async () => {
    const mockDonors = [createTestDonor({ wilaya: 'Adrar' })];
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const filters: SearchFilters = { wilaya: 'Adrar' };
    const result = await searchDonors(filters);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should filter by emergency availability', async () => {
    const mockDonors = [createTestDonor({ emergencyAvailable: true })];
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const filters: SearchFilters = { emergencyOnly: true };
    const result = await searchDonors(filters);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should search with multiple filters', async () => {
    const mockDonors = [
      createTestDonor({
        bloodGroup: 'O+',
        wilaya: 'Adrar',
        emergencyAvailable: true,
      }),
    ];
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const filters: SearchFilters = {
      bloodGroup: 'O+',
      wilaya: 'Adrar',
      emergencyOnly: true,
    };
    const result = await searchDonors(filters);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should return empty array when no donors match', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const filters: SearchFilters = { bloodGroup: 'AB-' };
    const result = await searchDonors(filters);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should handle database errors gracefully', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const filters: SearchFilters = { bloodGroup: 'O+' };
    const result = await searchDonors(filters);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should search without filters', async () => {
    const mockDonors = [createTestDonor(), createTestDonor()];
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockDonors),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await searchDonors();
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});

