import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { PauseCircle } from "lucide-react";
import { PAUSE_SHORT_AR, PAUSE_SHORT_FR } from "@/lib/pause-notice";

/** Shown instead of the register/search UI while the platform is on hold. */
export function PauseNoticeCard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <PauseCircle className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle dir="ltr" lang="fr" className="text-2xl text-primary">{PAUSE_SHORT_FR}</CardTitle>
                    <CardDescription dir="rtl" lang="ar" className="text-base">
                        {PAUSE_SHORT_AR}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Link href="/pause" className="text-primary underline font-medium">
                        En savoir plus / اقرأ المزيد
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
