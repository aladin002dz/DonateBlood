import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { Navigation } from './navigation';
import { useSession } from '@/lib/auth-client';

// Mock dependencies
vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Navigation', () => {
  it('should render navigation for unauthenticated users', () => {
    vi.mocked(useSession).mockReturnValue({ data: null, isPending: false, isRefetching: false, error: null, refetch: vi.fn() });
    
    render(<Navigation />);
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should render navigation for authenticated users', () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        session: {
          id: 'session-id',
          userId: 'user-id',
          expiresAt: new Date(),
          token: 'token',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      isPending: false,
      isRefetching: false,
      error: null,
      refetch: vi.fn(),
    });
    
    render(<Navigation />);
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});

