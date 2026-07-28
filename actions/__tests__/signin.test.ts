import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customSignIn } from '../signin';
import { db } from '@/db/db';
import { auth } from '@/lib/auth';

// Mock dependencies
vi.mock('@/db/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
}));

describe('customSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully sign in with valid credentials', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      name: 'Test User',
      phone: '1234567890',
    };
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: {
        ...mockUser,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
        banned: false,
      },
      redirect: false,
      token: 'session-token',
      url: undefined,
    });
    
    const result = await customSignIn('test@example.com', 'password123');
    
    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(result.redirect).toBe('/profile');
  });

  it('should return error if identifier is missing', async () => {
    const result = await customSignIn('', 'password123');
    
    expect(result.error).toBe('Identifier and password are required');
  });

  it('should return error if password is missing', async () => {
    const result = await customSignIn('test@example.com', '');
    
    expect(result.error).toBe('Identifier and password are required');
  });

  it('should return error if user not found', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await customSignIn('nonexistent@example.com', 'password123');
    
    expect(result.error).toBe('User not found');
  });

  it('should return error if user has no email', async () => {
    const mockUser = {
      id: 'user-id',
      email: null,
      name: 'Test User',
      phone: '1234567890',
    };
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await customSignIn('test@example.com', 'password123');
    
    expect(result.error).toBe('User account is missing email address');
  });

  it('should return error for incorrect password', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      name: 'Test User',
    };
    
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser]),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    vi.mocked(auth.api.signInEmail).mockRejectedValue(new Error('Invalid credentials'));
    
    const result = await customSignIn('test@example.com', 'wrongpassword');
    
    expect(result.error).toBe('Incorrect password');
  });

  it('should handle errors gracefully', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    });
    
    vi.mocked(db.select).mockImplementation(mockSelect as never);
    
    const result = await customSignIn('test@example.com', 'password123');
    
    expect(result.error).toBeDefined();
  });
});

