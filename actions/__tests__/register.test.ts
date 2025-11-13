import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '../register';
import { db } from '@/db/db';
import { auth } from '@/lib/auth';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
    
    // Mock database queries
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // No existing user
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    // Mock auth signup
    (auth.api.signUpEmail as any).mockResolvedValue({
      user: {
        id: 'test-user-id',
        email: formData.get('email'),
        name: formData.get('fullName'),
      },
    });
    
    // Mock update
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    (db.update as any) = mockUpdate;
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(true);
    expect(result.redirectTo).toBe('/profile');
  });

  it('should return error if email already exists', async () => {
    const formData = createTestUserFormData();
    
    // Mock existing user
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 'existing-user' }]),
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('already exists');
  });

  it('should return error if phone number already exists', async () => {
    const formData = createTestUserFormData();
    
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
    
    (db.select as any) = mockSelect;
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('phone number already exists');
  });

  it('should return error for invalid phone number', async () => {
    const formData = createTestUserFormData();
    formData.set('phone', '123'); // Invalid phone
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('valid phone number');
  });

  it('should return error if passwords do not match', async () => {
    const formData = createTestUserFormData();
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
    
    (db.select as any) = mockSelect;
    
    const result = await registerUser(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

