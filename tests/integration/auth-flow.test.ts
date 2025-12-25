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

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full registration and sign-in flow', async () => {
    const formData = createTestUserFormData();
    // Ensure phone number is in valid format for registration
    formData.set('phone', '+1234567890');
    const userId = 'test-user-id';

    // Step 1: Register user
    // Mock db.select to return empty arrays for both email and phone checks
    // Each call to db.select() should return a fresh chain
    vi.mocked(db.select).mockImplementation(() => ({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // No existing user
        }),
      }),
    }) as never);
    vi.mocked(auth.api.signUpEmail).mockResolvedValue({
      user: {
        id: userId,
        email: formData.get('email') as string,
        name: formData.get('fullName') as string,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'signup-token',
    });

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    vi.mocked(db.update).mockImplementation(mockUpdate as never);

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

    vi.mocked(db.select).mockImplementation(mockSelectSignIn as never);
    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: {
        ...mockUser,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
      },
      redirect: false,
      token: 'session-token',
      url: undefined,
    });

    const signInResult = await customSignIn(
      formData.get('email') as string,
      formData.get('password') as string
    );

    expect(signInResult.success).toBe(true);

    // Step 3: Get profile
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: userId, email: 'test@example.com', name: 'Test User', emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date(), banned: null, role: 'user', banReason: null, banExpires: null },
      session: { id: 'session-id', userId: userId, expiresAt: new Date(), token: 'token', createdAt: new Date(), updatedAt: new Date() },
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

    vi.mocked(db.select).mockImplementation(mockSelectProfile as never);

    const profileResult = await getProfile();
    expect(profileResult.success).toBe(true);
    expect(profileResult.data?.id).toBe(userId);
  });
});

