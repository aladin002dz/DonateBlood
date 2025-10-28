"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Globe, Heart, Home, LogIn, LogOut, Search, User, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

export function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    ...(session
      ? [
        { href: "/profile", label: t('profile'), icon: User },
        { href: "/search", label: t('search'), icon: Search },
        {
          href: "#",
          label: t('logout'),
          icon: LogOut,
          onClick: handleSignOut,
        },
      ]
      : [
        { href: "/search", label: t('search'), icon: Search },
        { href: "/signin", label: t('signin'), icon: LogIn },
        { href: "/register", label: t('register'), icon: UserPlus },
      ]),
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
  ]

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '') || '/'
    router.push(`/${newLocale}${currentPath}`)
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <span className="text-xl font-bold text-primary">Don de Sang DZ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select value={locale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Navigation Items */}
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isSignOut = 'onClick' in item

                if (isSignOut) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className={cn(
                        "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
                        "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
                      pathname === item.href
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Selector for Mobile */}
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Navigation Items */}
            <div className="flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isSignOut = 'onClick' in item

                if (isSignOut) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className={cn(
                        "p-2 rounded-md transition-colors hover:bg-secondary",
                        "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "p-2 rounded-md transition-colors hover:bg-secondary",
                      pathname === item.href
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
