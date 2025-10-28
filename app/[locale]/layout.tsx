import { routing } from '@/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';


import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Don de Sang DZ - Blood Donation Algeria",
  description: "Connect blood donors and recipients in Algeria. One donation can save three lives.",
  generator: "v0.app",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <NextIntlClientProvider locale={locale}>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div>Loading...</div>}>
                <Navigation />
                <main className="flex-1 bg-secondary/30">{children}</main>
              </Suspense>
              <Footer />
            </div>
            <ThemeToggle />
            <Toaster
              richColors
              position="top-right"
            />
          </ThemeProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
