"use client"

import { Heart } from "lucide-react"
import { useTranslations } from 'next-intl'
import Link from "next/link"

function GithubIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    )
}

export function Footer() {
    const t = useTranslations('Footer')

    return (
        <footer className="bg-background border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:space-x-2 text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <span>{t('builtWith')}</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>{t('by')}</span>
                        <Link
                            href="https://www.linkedin.com/in/mahfoudh-arous/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                            Mahfoudh Arous
                        </Link>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <Link
                        href="https://github.com/aladin002dz/DonateBlood"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center space-x-1"
                    >
                        <GithubIcon className="h-4 w-4" />
                        <span>{t('sourceCode')}</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
