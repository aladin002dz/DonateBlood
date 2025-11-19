import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default function middleware(request: any) {
    console.log('Middleware running for:', request.url);
    return createMiddleware(routing)(request);
}

export const config = {
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
}
