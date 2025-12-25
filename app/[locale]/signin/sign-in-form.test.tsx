import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/tests/utils';
import userEvent from '@testing-library/user-event';
import SignIn from './sign-in-form';
import { customSignIn } from '@/actions/signin';
import { signIn } from '@/lib/auth-client';

// Mock dependencies
vi.mock('@/actions/signin', () => ({
  customSignIn: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
  signIn: {
    email: vi.fn(),
    social: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignIn Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sign-in form', () => {
    render(<SignIn />);

    // Check that "Sign In" text appears (could be in title or button)
    const signInTexts = screen.getAllByText(/sign in/i);
    expect(signInTexts.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email or phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it('should show validation error for empty identifier', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const identifierInput = screen.getByLabelText(/email or phone/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    // Type something in identifier and then clear it to trigger validation
    await user.type(identifierInput, 'test');
    await user.clear(identifierInput);

    // Type password to make form partially valid
    await user.type(passwordInput, 'password123');

    // Blur the identifier field to trigger validation
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/email or phone number is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const identifierInput = screen.getByLabelText(/email or phone/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(identifierInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    // Trigger validation by blurring the field
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/valid email address or phone number/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const identifierInput = screen.getByLabelText(/email or phone/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(identifierInput, 'test@example.com');
    await user.type(passwordInput, '123');

    await waitFor(() => {
      expect(screen.getByText(/6 characters/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid email credentials', async () => {
    const user = userEvent.setup();
    vi.mocked(signIn.email).mockResolvedValue({});

    render(<SignIn />);

    const identifierInput = screen.getByLabelText(/email or phone/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(identifierInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signIn.email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        })
      );
    });
  });

  it('should submit form with phone number using custom sign-in', async () => {
    const user = userEvent.setup();
    vi.mocked(customSignIn).mockResolvedValue({
      success: true,
      redirect: '/profile',
      user: {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        emailVerified: false,
        phoneVerified: false,
        image: null,
        role: 'user',
        banned: null,
        banReason: null,
        banExpires: null,
        bloodGroup: null,
        wilaya: null,
        daira: null,
        commune: null,
        lastDonation: null,
        donationType: null,
        emergencyAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    render(<SignIn />);

    const identifierInput = screen.getByLabelText(/email or phone/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(identifierInput, '1234567890');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(customSignIn).toHaveBeenCalledWith('1234567890', 'password123');
    });
  });

  it('should disable submit button when loading', async () => {
    const user = userEvent.setup();
    vi.mocked(signIn.email).mockImplementation(() => new Promise(() => { })); // Never resolves

    render(<SignIn />);

    const identifierInput = screen.getByLabelText(/email or phone/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(identifierInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should show forgot password link', () => {
    render(<SignIn />);

    const forgotLink = screen.getByText(/forgot/i);
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });
});

