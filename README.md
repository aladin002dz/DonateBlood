# Better Auth Protection Demo

## Technical Stack
<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better%20Auth-FF6B35?style=flat-square&logo=shield&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-black?style=flat-square&logo=shadcnui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)


</div>

<div align="center">

A modern Next.js application demonstrating secure authentication with **Better Auth**, featuring social login providers, email/password authentication, and a beautiful user dashboard.

[🚀 Live Demo](#) • [📖 Documentation](#learn-more) • [🐛 Report Bug](#) • [✨ Request Feature](#)

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


### Technical Stack


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


#### Core Technologies
- **Next.js 15** ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white) - Latest React framework with App Router
- **TypeScript** ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) - Full type safety throughout the application
- **Better Auth** ![Better Auth](https://img.shields.io/badge/Better%20Auth-FF6B35?style=flat-square&logo=shield&logoColor=white) - Modern authentication library
- **shadcn/ui** ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=react&logoColor=white) - Beautiful, accessible UI components
- **Tailwind CSS** ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) - Utility-first CSS framework
- **Lucide React** ![Lucide](https://img.shields.io/badge/Lucide-FF6B35?style=flat-square&logo=feather&logoColor=white) - Beautiful icons

#### Authentication & Security
- **Better Auth** ![Better Auth](https://img.shields.io/badge/Better%20Auth-FF6B35?style=flat-square&logo=shield&logoColor=white) - Secure, modern authentication library
- **OAuth 2.0** ![OAuth](https://img.shields.io/badge/OAuth-4285F4?style=flat-square&logo=google&logoColor=white) - Google and GitHub social login
- **Session Management** ![Security](https://img.shields.io/badge/Security-Green?style=flat-square&logo=security&logoColor=white) - Secure cookie-based sessions

#### UI & Styling
- **shadcn/ui** ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=react&logoColor=white) - Accessible component library built on Radix UI
- **Tailwind CSS** ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) - Utility-first CSS framework
- **Radix UI** ![Radix UI](https://img.shields.io/badge/Radix%20UI-000000?style=flat-square&logo=react&logoColor=white) - Unstyled, accessible UI primitives
- **Lucide React** ![Lucide](https://img.shields.io/badge/Lucide-FF6B35?style=flat-square&logo=feather&logoColor=white) - Beautiful, customizable icons

#### Development Tools
- **ESLint** ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) - Code linting and formatting
- **Turbopack** ![Turbopack](https://img.shields.io/badge/Turbopack-000000?style=flat-square&logo=turborepo&logoColor=white) - Fast bundler for development
- **PostCSS** ![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white) - CSS processing

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/[...all]/      # Better Auth API routes
│   ├── dashboard/         # Protected dashboard page
│   ├── signin/           # Sign-in page
│   ├── signup/           # Sign-up page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── sign-in.tsx      # Sign-in form component
│   └── sign-up.tsx      # Sign-up form component
├── lib/                 # Utility libraries
│   ├── auth.ts          # Better Auth server configuration
│   ├── auth-client.ts   # Better Auth client configuration
│   └── utils.ts         # Utility functions
└── hooks/               # Custom React hooks
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

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # App URL (for development)
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # GitHub OAuth (optional)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Email Configuration (for production)
   # Choose one of the following email services:
   
   # Option 1: Resend (recommended)
   # RESEND_API_KEY=your-resend-api-key
   # EMAIL_FROM=noreply@yourdomain.com
   
   # Option 2: SendGrid
   # SENDGRID_API_KEY=your-sendgrid-api-key
   # EMAIL_FROM=noreply@yourdomain.com
   
   # Option 3: AWS SES
   # AWS_ACCESS_KEY_ID=your-aws-access-key
   # AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   # AWS_REGION=us-east-1
   # EMAIL_FROM=noreply@yourdomain.com
   
   # Option 4: SMTP (generic)
   # SMTP_HOST=smtp.gmail.com
   # SMTP_PORT=587
   # SMTP_USER=your-email@gmail.com
   # SMTP_PASS=your-app-password
   # EMAIL_FROM=your-email@gmail.com
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

## 📖 Usage Guide

### Authentication Flow

1. **Sign Up**
   - Navigate to `/signup`
   - Fill in personal information (name, email, password)
   - Optionally upload a profile image
   - Choose email/password or social login
   - **Email Verification Required**: After signup, users must verify their email

2. **Email Verification**
   - Users are redirected to `/verify-email` after signup
   - Verification link is sent to their email address
   - Users can resend verification email if needed
   - Once verified, users are redirected to dashboard

3. **Sign In**
   - Navigate to `/signin`
   - Use email/password or social providers
   - Automatic redirect to dashboard upon success

4. **Dashboard**
   - Protected route requiring authentication
   - Email verification banner shown for unverified users
   - View profile information and account statistics
   - Access quick actions and sign out

### Key Components

#### Sign-In Component (`components/sign-in.tsx`)
- Social login buttons for Google and GitHub
- Email/password form with validation
- Loading states and error handling
- Automatic redirect on success

#### Sign-Up Component (`app/signup/sign-up-form.tsx`)
- Complete registration form with name, email, phone, and password
- Password confirmation
- Phone number validation
- Social authentication options (Google, GitHub)

#### Dashboard (`app/dashboard/page.tsx`)
- Protected route with session validation
- User profile display with initials-based avatar
- Account statistics and information
- Quick actions for account management

### API Routes

The authentication API is handled by Better Auth at `/api/[...all]/route.ts`:

```typescript
export const { GET, POST } = toNextJsHandler(auth.handler);
```

This catch-all route handles all authentication endpoints automatically.

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components including:

- **Forms** - Input, Label, Button with validation
- **Cards** - Card, CardHeader, CardContent, CardFooter
- **Navigation** - Buttons with icons and hover states
- **Feedback** - Toast notifications, loading states
- **Layout** - Separators, badges, avatars

## 🔒 Security Features

- **Secure Session Management** - Better Auth handles sessions securely
- **Protected Routes** - Dashboard requires authentication
- **CSRF Protection** - Built-in with Better Auth
- **Environment Variables** - Sensitive data properly configured
- **Input Validation** - Form validation on client and server

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production with Turbopack  
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Pages**: Add to `app/` directory following Next.js App Router conventions
2. **Components**: Add to `components/` directory
3. **UI Components**: Use `npx shadcn-ui@latest add [component]` to add new shadcn components
4. **Authentication**: Modify `lib/auth.ts` for new auth features

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
