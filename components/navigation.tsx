"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Globe, Heart, Home, LogIn, LogOut, Menu, Search, User, UserPlus, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void | Promise<void>
}

export function Navigation() {
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  const navItems: NavItem[] = [
    { href: "/", label: t("home"), icon: Home },
    ...(session
      ? [
        { href: "/search", label: t("search"), icon: Search },
        { href: "/profile", label: t("profile"), icon: User },
        {
          href: "#",
          label: t("logout"),
          icon: LogOut,
          onClick: handleSignOut,
        },
      ]
      : [
        { href: "/search", label: t("search"), icon: Search },
        { href: "/signin", label: t("signin"), icon: LogIn },
        { href: "/register", label: t("register"), icon: UserPlus },
      ]),
  ]

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "fr", name: "Français" },
  ]

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie immediately for persistence across all pages
    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; Path=/; Max-Age=31536000; SameSite=Lax`
    } catch { }
    // Use next-intl router to update the URL with the new locale
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary fill-current" />
          <span className="hidden font-bold sm:inline-block text-primary">{t("brandName")}</span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6">
          {/* Desktop Navigation Items */}
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-foreground/80",
                      "text-muted-foreground hover:text-foreground",
                      "flex items-center space-x-1.5",
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
                    "text-sm font-medium transition-colors hover:text-foreground/80",
                    "flex items-center space-x-1.5",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Language Selector */}
          <div className="flex items-center space-x-2 border-l border-border pl-6">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-8 w-[140px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
          {/* Mobile Language Selector */}
          <div className="flex items-center">
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-8 w-[120px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "left" : "right"} className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col space-y-4 py-6">
                {/* Mobile Logo in Menu */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-2 py-2"
                >
                  <Heart className="h-6 w-6 text-primary fill-current" />
                  <span className="font-bold text-primary">{t("brandName")}</span>
                </Link>

                {/* Mobile Navigation Items */}
                <nav className="flex flex-col space-y-1 px-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    if (item.onClick) {
                      return (
                        <button
                          key={item.label}
                          onClick={async () => {
                            setIsOpen(false)
                            await item.onClick?.()
                          }}
                          className={cn(
                            "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            "w-full text-left",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      )
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          "w-full",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
