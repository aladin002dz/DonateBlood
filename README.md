# Donate Blood Platform

This application is a platform for donating blood and finding donors.

**Current version:** 0.8.0 (beta)

## Technical Stack
<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better%20Auth-FF6B35?style=flat-square&logo=shield&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-black?style=flat-square&logo=shadcnui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-FF6B35?style=flat-square&logo=drizzle&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=flat-square&logo=react&logoColor=white)


</div>

<div align="center">

[🚀 Live Demo](https://donate-blood-virid.vercel.app/) • [🐛 Report Bug](https://github.com/aladin002dz/DonateBlood/issues) • [✨ Request Feature](https://github.com/aladin002dz/DonateBlood/issues)

</div>

## Add Drizzle

```bash
npm i drizzle-orm @neondatabase/serverless dotenv
npm i -D drizzle-kit tsx
```

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

Create the database file under `db/db.ts`

Create the drizzle.config.ts file under the root directory

then run to generate the schema of authentication

```bash
npx @better-auth/cli generate
```

Push schema to the database

```bash
npx drizzle-kit push
```

## Husky

```bash
npm install husky
npx husky init
```
Edit the `.husky/pre-commit` file to run the build command

Add the following to the `.husky/pre-commit` file
```bash
npm run build
```

Add the following to the `.gitignore` file
```bash
.husky/_
```


## 🚀 Features

### Authentication
- **Email & Password Authentication** - Secure sign-up and sign-in
- **Email Verification** - Required email verification for new accounts
- **Social Login Providers** - Google and GitHub OAuth integration
- **Profile Management** - Upload profile images and manage user information
- **Session Management** - Secure session handling with automatic redirects
- **Protected Routes** - Dashboard access requires authentication

### UI/UX
- **Modern Design** - Built with shadcn/ui components and Tailwind CSS
- **Responsive Layout** - Mobile-first design that works on all devices
- **Dark Mode Support** - Automatic theme switching
- **Loading States** - Smooth loading indicators and error handling
- **Toast Notifications** - User-friendly feedback with Sonner

## ✅ Features Checklist

### 🔐 Authentication & Security
- [x] **Email & Password Authentication** - Secure sign-up and sign-in
- [x] **Email Verification** - Required email verification for new accounts
- [x] **Social Login Providers** - Google and GitHub OAuth integration
- [x] **Profile Management** - Upload profile images and manage user information
- [x] **Session Management** - Secure session handling with automatic redirects
- [x] **Protected Routes** - Dashboard access requires authentication
- [x] **Password Reset** - Forgot password functionality
- [ ] **Account Lockout** - Security after multiple failed attempts

### 🎨 UI/UX Features
- [x] **Modern Design** - Built with shadcn/ui components and Tailwind CSS
- [x] **Responsive Layout** - Mobile-first design that works on all devices
- [x] **Loading States** - Smooth loading indicators and error handling
- [x] **Toast Notifications** - User-friendly feedback with Sonner
- [x] **Dark Mode Support** - Automatic theme switching
- [x] **Accessibility Features** - Screen reader support and keyboard navigation
- [x] **Internationalization (i18n)** - Multi-language support
- [x] **PWA Support** - Progressive Web App capabilities

### 🔧 Technical Features
- [x] **Database Integration** - Drizzle ORM with PostgreSQL
- [x] **Form Validation** - Zod schema validation
- [x] **Form Handling** - React Hook Form integration
- [ ] **Real-time Notifications** - WebSocket or Server-Sent Events
- [ ] **API Rate Limiting** - Protect against abuse
- [ ] **Caching Strategy** - Redis or in-memory caching
- [x] **Search Functionality** - Advanced search and filtering

### 🚀 Performance & Deployment
- [x] **Next.js 15** - Latest React framework with App Router
- [x] **TypeScript** - Full type safety throughout the application
- [x] **ESLint** - Code linting and formatting
- [ ] **Performance Monitoring** - Analytics and error tracking
- [ ] **SEO Optimization** - Meta tags and structured data
- [ ] **CDN Integration** - Global content delivery
- [ ] **Database Optimization** - Query optimization and indexing
- [x] **Automated Testing** - Unit, integration, and E2E tests

## 🔧 Configuration

### Better Auth Setup

The authentication is configured in `lib/auth.ts`:

```typescript
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },
    plugins: [nextCookies()],
});
```

### OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`


## 🧪 Testing

This project includes comprehensive testing infrastructure with unit, integration, and end-to-end tests.

### Testing Stack

- **Vitest** - Fast unit and integration testing
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing for critical user flows
- **MSW (Mock Service Worker)** - API mocking for integration tests

### Running Tests

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Structure

```
├── actions/__tests__/          # Server action unit tests
├── components/                  # Component tests (co-located)
│   ├── navigation.test.tsx
│   └── theme-toggle.test.tsx
├── lib/__tests__/              # Utility function tests
├── app/[locale]/signin/        # Page component tests
│   └── sign-in-form.test.tsx
├── tests/                      # Test utilities and setup
│   ├── setup.ts               # Global test setup
│   ├── utils.tsx              # Custom render functions
│   ├── factories/             # Test data factories
│   ├── mocks/                 # Mock implementations
│   └── integration/           # Integration tests
├── e2e/                        # End-to-end tests
│   ├── auth.spec.ts
│   ├── search.spec.ts
│   └── profile.spec.ts
├── vitest.config.ts           # Vitest configuration
└── playwright.config.ts       # Playwright configuration
```

### Test Organization

- **Components**: Tests are co-located with components (same folder)
- **Pages**: Page tests are in `__tests__` folders within page directories
- **Server Actions**: Tests are in `__tests__` folders within action directories
- **Utilities**: Tests are in `__tests__` folders within lib directories

### Coverage Goals

- Server actions: 80%+ coverage
- Utility functions: 90%+ coverage
- Components: 70%+ coverage
- Overall: 75%+ coverage

### Writing Tests

When writing new tests:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between multiple components or services
3. **E2E Tests**: Test complete user flows from start to finish

Example unit test:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [Better Auth Documentation](https://better-auth.com) - Authentication library docs
- [shadcn/ui Documentation](https://ui.shadcn.com) - UI component library
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - CSS framework
- [Drizzle Documentation](https://orm.drizzle.team/docs/introduction) - Database ORM library
- [Vitest Documentation](https://vitest.dev) - Testing framework
- [Playwright Documentation](https://playwright.dev) - E2E testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
