import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updateProfile } from '../profile';
import { db } from '@/db/db';
import { auth } from '@/lib/auth';

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
      user: { id: 'user-id', email: 'test@example.com', name: 'Test User', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'session-id', userId: 'user-id', expiresAt: new Date(), token: 'token', createdAt: new Date(), updatedAt: new Date() },
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
    
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockProfile]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await getProfile();
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe('user-id');
  });

  it('should return error if not authenticated', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);
    
    const result = await getProfile();
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error if user not found', async () => {
    const mockSession = {
      user: { id: 'user-id', email: 'test@example.com', name: 'Test User', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'session-id', userId: 'user-id', expiresAt: new Date(), token: 'token', createdAt: new Date(), updatedAt: new Date() },
    };
    
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
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
      user: { id: 'user-id', email: 'test@example.com', name: 'Test User', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'session-id', userId: 'user-id', expiresAt: new Date(), token: 'token', createdAt: new Date(), updatedAt: new Date() },
    };
    
    const formData = new FormData();
    formData.append('name', 'Updated Name');
    formData.append('bloodGroup', 'A+');
    
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
    
    // Mock no existing user with same email/phone
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    
    vi.mocked(db.update).mockImplementation(mockUpdate as never);
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('successfully');
  });

  it('should return error if not authenticated', async () => {
    const formData = new FormData();
    formData.append('name', 'Updated Name');
    
    vi.mocked(auth.api.getSession).mockResolvedValue(null);
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return error for invalid phone number', async () => {
    const mockSession = {
      user: { id: 'user-id', email: 'test@example.com', name: 'Test User', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'session-id', userId: 'user-id', expiresAt: new Date(), token: 'token', createdAt: new Date(), updatedAt: new Date() },
    };
    
    const formData = new FormData();
    formData.append('phone', '123'); // Invalid - too short
    
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(false);
    // The error could be from zod validation (min length) or phone regex validation
    expect(result.error).toMatch(/phone number|valid phone/i);
  });

  it('should return error if email already exists', async () => {
    const mockSession = {
      user: { id: 'user-id', email: 'test@example.com', name: 'Test User', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() },
      session: { id: 'session-id', userId: 'user-id', expiresAt: new Date(), token: 'token', createdAt: new Date(), updatedAt: new Date() },
    };
    
    const formData = new FormData();
    formData.append('email', 'existing@example.com');
    
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
    
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
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await updateProfile(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('already exists');
  });
});

