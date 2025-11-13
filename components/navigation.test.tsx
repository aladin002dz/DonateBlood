import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { Navigation } from './navigation';
import { useSession, signOut } from '@/lib/auth-client';

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
    (useSession as any).mockReturnValue({ data: null });
    
    render(<Navigation />);
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should render navigation for authenticated users', () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          id: 'user-id',
          email: 'test@example.com',
        },
      },
    });
    
    render(<Navigation />);
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});

