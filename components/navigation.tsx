"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Globe, Heart, Home, LogIn, LogOut, Menu, Search, User, UserPlus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

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

  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    ...(session
      ? [
        { href: "/profile", label: t("profile"), icon: User },
        { href: "/search", label: t("search"), icon: Search },
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
    const currentPath = pathname.replace(`/${locale}`, "") || "/"
    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; Path=/; Max-Age=31536000; SameSite=Lax`
    } catch { }
    router.push(`/${newLocale}${currentPath}`)
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <span className="text-xl font-bold text-primary">{t("brandName")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select value={locale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue placeholder={t("selectLanguage")} />
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
                const isSignOut = "onClick" in item

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

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-md transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Language Selector in Mobile Menu */}
                  <div className="flex items-center space-x-2 px-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Select value={locale} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder={t("selectLanguage")} />
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

                  {/* Mobile Navigation Items */}
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isSignOut = "onClick" in item

                      if (isSignOut) {
                        return (
                          <button
                            key={item.label}
                            onClick={() => {
                              item.onClick?.()
                              setIsOpen(false)
                            }}
                            className={cn(
                              "w-full flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
                              "text-muted-foreground hover:text-foreground",
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
                            "flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
                            pathname === item.href
                              ? "text-primary bg-secondary"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
