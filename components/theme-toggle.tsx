"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const themes = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "system", icon: Monitor, label: "System" },
        { value: "dark", icon: Moon, label: "Dark" },
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="flex items-center rounded-full border border-border bg-card/80 backdrop-blur-sm p-1 shadow-lg">
                {themes.map(({ value, icon: Icon, label }) => (
                    <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`
              relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200
              ${theme === value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }
            `}
                        aria-label={`Switch to ${label} theme`}
                        title={`Switch to ${label} theme`}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                ))}
            </div>
        </div>
    )
}
