import { Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-background border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>Built with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>by</span>
                        <Link
                            href="https://github.com/aladin002dz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                            Mahfoudh Arous
                        </Link>
                    </div>
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                        <Link
                            href="https://github.com/aladin002dz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            GitHub
                        </Link>
                        <span>•</span>
                        <Link
                            href="https://www.linkedin.com/in/mahfoudh-arous/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            LinkedIn
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
