import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '../register';
import { db } from '@/db/db';
import { auth } from '@/lib/auth';
import { createTestUserFormData } from '@/tests/factories/user.factory';

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
      signUpEmail: vi.fn(),
    },
  },
}));

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const formData = createTestUserFormData();
    // Ensure phone is valid to pass phone validation
    formData.set('phone', '+1234567890');
    
    // Mock database queries
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // No existing user
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    // Mock auth signup
    vi.mocked(auth.api.signUpEmail).mockResolvedValue({
      user: {
        id: 'test-user-id',
        email: formData.get('email') as string,
        name: formData.get('fullName') as string,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        banned: false,
        role: 'user',
        banReason: null,
        banExpires: null,
      },
      token: 'signup-token',
    });
    
    // Mock update
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    vi.mocked(db.update).mockImplementation(mockUpdate as never);
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(true);
    expect(result.redirectTo).toBe('/profile');
  });

  it('should return error if email already exists', async () => {
    const formData = createTestUserFormData();
    // Ensure phone is valid to pass phone validation
    formData.set('phone', '+1234567890');
    
    // Mock existing user
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 'existing-user' }]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('already exists');
  });

  it('should return error if phone number already exists', async () => {
    const formData = createTestUserFormData();
    // Ensure phone is valid to pass phone validation
    formData.set('phone', '+1234567890');
    
    // Mock no existing email, but existing phone
    let callCount = 0;
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve([]); // No existing email
            }
            return Promise.resolve([{ id: 'existing-user' }]); // Existing phone
          }),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('phone number already exists');
  });

  it('should return error for invalid phone number', async () => {
    const formData = createTestUserFormData();
    formData.set('phone', '123'); // Invalid phone - too short
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    // The error could be from zod validation (min length) or phone regex validation
    expect(result.error).toMatch(/phone number|valid phone/i);
  });

  it('should return error if passwords do not match', async () => {
    const formData = createTestUserFormData();
    // Ensure phone is valid to pass phone validation
    formData.set('phone', '+1234567890');
    formData.set('password', 'password123');
    formData.set('confirmPassword', 'different123');
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain("Passwords don't match");
  });

  it('should return error for invalid email', async () => {
    const formData = createTestUserFormData();
    formData.set('email', 'invalid-email');
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle database errors gracefully', async () => {
    const formData = createTestUserFormData();
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

