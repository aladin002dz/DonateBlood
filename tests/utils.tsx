import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import type React from 'react';

// Mock messages for i18n
const mockMessages = {
  Auth: {
    SignIn: {
      title: 'Sign In',
      email: 'Email',
      password: 'Password',
      submit: 'Sign In',
    },
    SignUp: {
      title: 'Sign Up',
    },
  },
  Validation: {
    required: 'This field is required',
    email: 'Invalid email',
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

