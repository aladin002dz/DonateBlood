import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestPasswordReset, resetPassword, validateResetToken } from '../password-reset';
import { auth } from '@/lib/auth';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      forgetPassword: vi.fn(),
      resetPassword: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
}));

describe('requestPasswordReset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully request password reset', async () => {
    vi.mocked(auth.api.forgetPassword).mockResolvedValue({ status: true });
    
    const result = await requestPasswordReset('test@example.com');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('sent');
  });

  it('should return error if reset fails', async () => {
    vi.mocked(auth.api.forgetPassword).mockResolvedValue({ status: false });
    
    const result = await requestPasswordReset('test@example.com');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(auth.api.forgetPassword).mockRejectedValue(new Error('API error'));
    
    const result = await requestPasswordReset('test@example.com');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('resetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully reset password', async () => {
    vi.mocked(auth.api.resetPassword).mockResolvedValue({ status: true });
    
    const result = await resetPassword('valid-token', 'newPassword123');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('successfully');
  });

  it('should return error for invalid token', async () => {
    vi.mocked(auth.api.resetPassword).mockResolvedValue({ status: false });
    
    const result = await resetPassword('invalid-token', 'newPassword123');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid or expired');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(auth.api.resetPassword).mockRejectedValue(new Error('API error'));
    
    const result = await resetPassword('token', 'newPassword123');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validateResetToken', () => {
  it('should validate token successfully', async () => {
    const result = await validateResetToken('valid-token');
    
    expect(result.valid).toBe(true);
  });

  it('should return error if no token provided', async () => {
    const result = await validateResetToken('');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

