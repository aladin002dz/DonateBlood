import { ThemeProvider } from '@/components/theme-provider';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type React from 'react';

// Mock messages for i18n
const mockMessages = {
  Auth: {
    SignIn: {
      title: 'Sign In',
      description: 'Enter your credentials to access your account',
      identifierLabel: 'Email or Phone Number',
      identifierPlaceholder: 'm@example.com or +1234567890',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Password',
      submit: 'Sign In',
      forgot: 'Forgot your password?',
      continueWith: 'Or continue with',
      continueGoogle: 'Continue with Google',
      continueGithub: 'Continue with GitHub',
      toastSuccess: 'Signed in successfully',
      toastNetwork: 'Network error. Please check your connection and try again.',
      toastGeneric: 'An error occurred during sign-in',
      toastGoogle: 'An error occurred during Google sign-in',
      toastGithub: 'An error occurred during GitHub sign-in',
      errorIncorrectPassword: 'Incorrect password',
      errorUserNotFound: 'User not found',
    },
    SignUp: {
      title: 'Sign Up',
    },
  },
  Validation: {
    required: 'This field is required',
    email: 'Invalid email',
    requiredIdentifier: 'Email or phone number is required',
    identifierInvalid: 'Please enter a valid email address or phone number (e.g., +1234567890)',
    requiredPassword: 'Password is required',
    minPassword6: 'Password must be at least 6 characters',
  },
  Navigation: {
    home: 'Home',
    search: 'Search',
    signin: 'Sign In',
    register: 'Register',
    profile: 'Profile',
    logout: 'Logout',
    brandName: 'DonateBlood',
    selectLanguage: 'Select Language',
  },
};

interface AllTheProvidersProps {
  children: React.ReactNode;
  locale?: string;
}

function AllTheProviders({ children, locale = 'en' }: AllTheProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={mockMessages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string;
}

function customRender(
  ui: React.ReactElement,
  { locale, ...renderOptions }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

