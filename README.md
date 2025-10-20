# Better Auth Protection Demo

## Technical Stack
<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better%20Auth-FF6B35?style=flat-square&logo=shield&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-black?style=flat-square&logo=shadcnui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-FF6B35?style=flat-square&logo=drizzle&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=flat-square&logo=react&logoColor=white)


</div>

<div align="center">

A modern Next.js application demonstrating secure authentication with **Better Auth**, featuring social login providers, email/password authentication, and a beautiful user dashboard.

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
- [ ] **Two-Factor Authentication (2FA)** - Additional security layer
- [ ] **Password Reset** - Forgot password functionality
- [ ] **Account Lockout** - Security after multiple failed attempts

### 🎨 UI/UX Features
- [x] **Modern Design** - Built with shadcn/ui components and Tailwind CSS
- [x] **Responsive Layout** - Mobile-first design that works on all devices
- [x] **Loading States** - Smooth loading indicators and error handling
- [x] **Toast Notifications** - User-friendly feedback with Sonner
- [ ] **Dark Mode Support** - Automatic theme switching
- [ ] **Accessibility Features** - Screen reader support and keyboard navigation
- [ ] **Internationalization (i18n)** - Multi-language support
- [ ] **PWA Support** - Progressive Web App capabilities

### 🩸 Blood Donation Features
- [ ] **Donor Registration** - Complete donor profile creation
- [ ] **Blood Type Management** - Track and manage blood types
- [ ] **Donation History** - Track past donations and eligibility
- [ ] **Appointment Booking** - Schedule donation appointments
- [ ] **Donor Search** - Find donors by location and blood type
- [ ] **Emergency Requests** - Urgent blood donation requests
- [ ] **Donation Reminders** - Automated notifications for eligible donations
- [ ] **Blood Bank Integration** - Connect with local blood banks

### 📊 Dashboard & Analytics
- [x] **User Dashboard** - Basic user profile and account information
- [ ] **Donation Statistics** - Personal donation history and impact
- [ ] **Achievement System** - Badges and milestones for donors
- [ ] **Health Tracking** - Pre-donation health assessments
- [ ] **Community Features** - Connect with other donors
- [ ] **Impact Metrics** - Lives saved and community impact

### 🔧 Technical Features
- [x] **Database Integration** - Drizzle ORM with PostgreSQL
- [x] **Form Validation** - Zod schema validation
- [x] **Form Handling** - React Hook Form integration
- [ ] **Real-time Notifications** - WebSocket or Server-Sent Events
- [ ] **File Upload** - Document and image upload functionality
- [ ] **API Rate Limiting** - Protect against abuse
- [ ] **Caching Strategy** - Redis or in-memory caching
- [ ] **Search Functionality** - Advanced search and filtering

### 🚀 Performance & Deployment
- [x] **Next.js 15** - Latest React framework with App Router
- [x] **TypeScript** - Full type safety throughout the application
- [x] **ESLint** - Code linting and formatting
- [ ] **Performance Monitoring** - Analytics and error tracking
- [ ] **SEO Optimization** - Meta tags and structured data
- [ ] **CDN Integration** - Global content delivery
- [ ] **Database Optimization** - Query optimization and indexing
- [ ] **Automated Testing** - Unit, integration, and E2E tests

## 📁 Project Structure

```
├── actions/                    # Server actions
│   ├── email.ts               # Email verification actions
│   └── register.ts            # User registration actions
├── app/                       # Next.js App Router
│   ├── api/                   # API routes
│   │   ├── [...all]/         # Better Auth API routes
│   │   ├── auth/             # Authentication endpoints
│   │   │   ├── custom-signin/ # Custom sign-in route
│   │   │   └── update-user/   # User update route
│   │   └── profile/          # Profile API route
│   ├── dashboard/            # Protected dashboard page
│   ├── profile/              # User profile page
│   ├── search/               # Search functionality
│   ├── signin/               # Sign-in page
│   ├── signup/               # Sign-up page
│   ├── verify-email/         # Email verification page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── loading.tsx           # Global loading component
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   │   ├── accordion.tsx     # Accordion component
│   │   ├── alert-dialog.tsx  # Alert dialog component
│   │   ├── avatar.tsx        # Avatar component
│   │   ├── button.tsx        # Button component
│   │   ├── card.tsx          # Card component
│   │   ├── dialog.tsx        # Dialog component
│   │   ├── form.tsx          # Form component
│   │   ├── input.tsx         # Input component
│   │   ├── label.tsx         # Label component
│   │   ├── select.tsx        # Select component
│   │   ├── table.tsx         # Table component
│   │   └── ...               # Other UI components
│   ├── email-verification-banner.tsx  # Email verification banner
│   ├── email-verification.tsx         # Email verification component
│   └── navigation.tsx                 # Navigation component
├── db/                       # Database configuration
│   ├── db.ts                 # Database connection
│   └── schema.ts             # Database schema
├── drizzle/                  # Database migrations
│   ├── 0000_next_nocturne.sql # Initial migration
│   ├── meta/                 # Migration metadata
│   ├── relations.ts          # Database relations
│   └── schema.ts             # Drizzle schema
├── hooks/                    # Custom React hooks
│   └── use-mobile.ts         # Mobile detection hook
├── lib/                      # Utility libraries
│   ├── auth.ts               # Better Auth server configuration
│   ├── auth-client.ts        # Better Auth client configuration
│   ├── email/                # Email templates
│   │   └── WelcomeVerificationEmail.tsx
│   ├── resend-client.ts      # Email service client
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
│   ├── file.svg              # File icon
│   ├── globe.svg             # Globe icon
│   ├── next.svg              # Next.js logo
│   ├── vercel.svg            # Vercel logo
│   └── window.svg            # Window icon
├── components.json            # shadcn/ui configuration
├── drizzle.config.ts         # Drizzle configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd better-auth-prot-i
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

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


## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [Better Auth Documentation](https://better-auth.com) - Authentication library docs
- [shadcn/ui Documentation](https://ui.shadcn.com) - UI component library
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - CSS framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
