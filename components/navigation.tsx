"use client"

import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Heart, Home, LogIn, LogOut, Search, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function Navigation() {
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
    { href: "/", label: "Home", icon: Home },
    ...(session
      ? [
        {
          href: "#",
          label: "Sign Out",
          icon: LogOut,
          onClick: handleSignOut,
        },
      ]
      : [
        { href: "/signin", label: "Sign In", icon: LogIn },
        { href: "/register", label: "Register", icon: UserPlus },
      ]),
    { href: "/search", label: "Search", icon: Search },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <span className="text-xl font-bold text-primary">Don de Sang DZ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex space-x-4">
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
    </nav>
  )
}
