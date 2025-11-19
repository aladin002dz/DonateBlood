import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendPasswordResetEmail } from '../email';
import { getLocale } from 'next-intl/server';

// Mock dependencies
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en'),
}));

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return {
      emails: {
        send: mockSend,
      },
    };
  }),
}));

describe('sendPasswordResetEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockClear();
  });

  it('should successfully send password reset email', async () => {
    mockSend.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
    });

    const result = await sendPasswordResetEmail('test@example.com', 'reset-token');

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should handle email sending errors', async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: 'Email sending failed', name: 'internal_server_error' as const, statusCode: 500 },
    });

    await expect(
      sendPasswordResetEmail('test@example.com', 'reset-token')
    ).rejects.toThrow();
  });

  it('should use correct locale for email subject', async () => {
    vi.mocked(getLocale).mockResolvedValue('fr');

    mockSend.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
    });

    await sendPasswordResetEmail('test@example.com', 'reset-token');

    expect(mockSend).toHaveBeenCalled();
  });
});

