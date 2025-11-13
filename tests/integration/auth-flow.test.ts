import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '@/actions/register';
import { customSignIn } from '@/actions/signin';
import { getProfile } from '@/actions/profile';
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
      signInEmail: vi.fn(),
      getSession: vi.fn(),
    },
  },
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full registration and sign-in flow', async () => {
    const formData = createTestUserFormData();
    const userId = 'test-user-id';
    
    // Step 1: Register user
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // No existing user
        }),
      }),
    });
    
    (db.select as any) = mockSelect;
    (auth.api.signUpEmail as any).mockResolvedValue({
      user: {
        id: userId,
        email: formData.get('email'),
        name: formData.get('fullName'),
      },
    });
    
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    (db.update as any) = mockUpdate;
    
    const registerResult = await registerUser(formData);
    expect(registerResult.success).toBe(true);
    
    // Step 2: Sign in
    const mockUser = {
      id: userId,
      email: formData.get('email') as string,
      name: formData.get('fullName') as string,
    };
    
    const mockSelectSignIn = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    
    (db.select as any) = mockSelectSignIn;
    (auth.api.signInEmail as any).mockResolvedValue({
      user: mockUser,
      session: { token: 'session-token' },
    });
    
    const signInResult = await customSignIn(
      formData.get('email') as string,
      formData.get('password') as string
    );
    
    expect(signInResult.success).toBe(true);
    
    // Step 3: Get profile
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: userId },
    });
    
    const mockProfile = {
      ...mockUser,
      emailVerified: false,
      phoneVerified: false,
      bloodGroup: formData.get('bloodGroup'),
      wilaya: formData.get('wilaya'),
      daira: formData.get('daira'),
      commune: formData.get('commune'),
      donationType: formData.get('donationType'),
      emergencyAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const mockSelectProfile = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockProfile]),
        }),
      }),
    });
    
    (db.select as any) = mockSelectProfile;
    
    const profileResult = await getProfile();
    expect(profileResult.success).toBe(true);
    expect(profileResult.data?.id).toBe(userId);
  });
});

