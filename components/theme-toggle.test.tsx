import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from 'next-themes';

// Mock dependencies
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ThemeToggle', () => {
  it('should render theme toggle button', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      themes: ['light', 'dark'],
      resolvedTheme: 'light',
      systemTheme: 'light',
    });
    
    render(<ThemeToggle />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0]).toBeInTheDocument();
  });
});

