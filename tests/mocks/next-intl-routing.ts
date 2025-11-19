export const defineRouting = () => ({});
export const createNavigation = () => ({
    Link: ({ children, ...props }: any) => children,
    redirect: () => { },
    usePathname: () => '/',
    useRouter: () => ({
        push: () => { },
        replace: () => { },
        back: () => { },
    }),
});
