import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updateProfile } from '../profile';
import { db } from '@/db/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Mock dependencies
vi.mock('@/db/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
}));

describe('getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully get user profile', async () => {
    const mockSession = {
      user: { id: 'user-id' },
    };
    
    const mockProfile = {
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      emailVerified: true,
      phoneVerified: false,
      bloodGroup: 'O+',
      wilaya: 'Adrar',
      daira: 'Adrar',
      commune: 'Adrar',
      lastDonation: null,
      donationType: 'Whole Blood',
      emergencyAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    (auth.api.getSession as any).mockResolvedValue(mockSession);
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockProfile]),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await getProfile();
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe('user-id');
  });

  it('should return error if not authenticated', async () => {
    (auth.api.getSession as any).mockResolvedValue(null);
    
    const result = await getProfile();
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error if user not found', async () => {
    const mockSession = {
      user: { id: 'user-id' },
    };
    
    (auth.api.getSession as any).mockResolvedValue(mockSession);
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await getProfile();
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('User not found');
  });
});

describe('updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully update profile', async () => {
    const mockSession = {
      user: { id: 'user-id' },
    };
    
    const formData = new FormData();
    formData.append('name', 'Updated Name');
    formData.append('bloodGroup', 'A+');
    
    (auth.api.getSession as any).mockResolvedValue(mockSession);
    
    // Mock no existing user with same email/phone
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    
    (db.update as any) = mockUpdate;
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('successfully');
  });

  it('should return error if not authenticated', async () => {
    const formData = new FormData();
    formData.append('name', 'Updated Name');
    
    (auth.api.getSession as any).mockResolvedValue(null);
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error for invalid phone number', async () => {
    const mockSession = {
      user: { id: 'user-id' },
    };
    
    const formData = new FormData();
    formData.append('phone', '123'); // Invalid
    
    (auth.api.getSession as any).mockResolvedValue(mockSession);
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('valid phone number');
  });

  it('should return error if email already exists', async () => {
    const mockSession = {
      user: { id: 'user-id' },
    };
    
    const formData = new FormData();
    formData.append('email', 'existing@example.com');
    
    (auth.api.getSession as any).mockResolvedValue(mockSession);
    
    let callCount = 0;
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve([{ id: 'other-user-id' }]); // Different user
            }
            return Promise.resolve([]);
          }),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('already exists');
  });
});

