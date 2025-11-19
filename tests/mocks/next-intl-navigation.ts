import { vi } from 'vitest';

export const createSharedPathnamesNavigation = () => ({
    Link: ({ children, ...props }: any) => children,
    usePathname: () => '/',
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
    }),
});

export const createNavigation = () => ({
    Link: ({ children, ...props }: any) => children,
    redirect: () => { },
    usePathname: () => '/',
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
    }),
    getPathname: () => '/',
});

export const Link = ({ children, ...props }: any) => children;
export const usePathname = () => '/';
export const useRouter = () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
});
