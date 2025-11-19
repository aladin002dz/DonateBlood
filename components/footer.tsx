"use client"

import { Github, Heart } from "lucide-react"
import { useTranslations } from 'next-intl'
import Link from "next/link"

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
                        <Github className="h-4 w-4" />
                        <span>{t('sourceCode')}</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
