import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAUSE_LONG_AR, PAUSE_LONG_FR } from "@/lib/pause-notice";
import { PauseCircle } from "lucide-react";

export default function PausePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="shadow-lg" dir="ltr" lang="fr">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <PauseCircle className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl md:text-3xl text-primary">
                            Plateforme en pause
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-relaxed whitespace-pre-line">{PAUSE_LONG_FR}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg" dir="rtl" lang="ar">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl md:text-3xl text-primary">
                            المنصة متوقفة مؤقتًا
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-relaxed whitespace-pre-line">{PAUSE_LONG_AR}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
