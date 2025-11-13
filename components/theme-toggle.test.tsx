import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from 'next-themes';

// Mock dependencies
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
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
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});

