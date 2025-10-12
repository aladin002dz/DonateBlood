"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sendVerificationEmail, useSession } from "@/lib/auth-client";
import { Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EmailVerificationBanner() {
    const { data: session, isPending } = useSession();
    const [resending, setResending] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const router = useRouter();

    // Don't show banner if session is loading, user is not logged in, or email is verified
    if (isPending || !session?.user || session.user.emailVerified || dismissed) {
        return null;
    }

    const handleResendVerification = async () => {
        if (!session?.user?.email) {
            toast.error("Email not found");
            return;
        }

        setResending(true);
        try {
            await sendVerificationEmail({
                email: session.user.email,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Verification email sent!");
                    },
                    onError: (ctx: { error: { message: string } }) => {
                        toast.error(ctx.error.message || "Failed to resend verification email");
                    }
                }
            });
        } catch {
            toast.error("Failed to resend verification email");
        } finally {
            setResending(false);
        }
    };


    return (
        <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                        <Mail className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-800">
                            Please verify your email address
                        </p>
                        <p className="text-xs text-amber-700">
                            Check your inbox for a verification link
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResendVerification}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    >
                        Resend Verification Email
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="text-amber-700 hover:bg-amber-100"
                    >
                        {resending ? "Sending..." : "Resend"}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDismissed(true)}
                        className="text-amber-700 hover:bg-amber-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
