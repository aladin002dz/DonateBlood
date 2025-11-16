import { vi } from 'vitest';

export const mockAuth = {
  api: {
    signUpEmail: vi.fn(),
    signInEmail: vi.fn(),
    signOut: vi.fn(),
    verifyEmail: vi.fn(),
    resetPassword: vi.fn(),
  },
  session: {
    data: null,
  },
};

export const mockAuthClient = {
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  signOut: vi.fn(),
  getSession: vi.fn(),
};

