import { vi } from 'vitest';

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  forward: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
};

export const mockUseRouter = () => mockRouter;
export const mockUsePathname = () => '/';
export const mockUseSearchParams = () => new URLSearchParams();

