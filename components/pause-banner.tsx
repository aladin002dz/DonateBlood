import { Link } from "@/i18n/navigation";
import { AlertTriangle } from "lucide-react";
import { PAUSE_SHORT_AR, PAUSE_SHORT_FR } from "@/lib/pause-notice";

export function PauseBanner() {
    return (
        <div className="w-full bg-amber-50 border-b border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100">
            <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span dir="ltr" lang="fr">{PAUSE_SHORT_FR}</span>
                </div>
                <span className="hidden sm:inline text-amber-400">•</span>
                <span dir="rtl" lang="ar">
                    {PAUSE_SHORT_AR}
                </span>
                <Link
                    href="/pause"
                    className="underline font-semibold shrink-0 hover:text-amber-700 dark:hover:text-amber-300"
                >
                    En savoir plus / اقرأ المزيد
                </Link>
            </div>
        </div>
    );
}
