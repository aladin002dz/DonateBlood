"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { sendVerificationEmail } from "@/lib/auth-client";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EmailVerification() {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resending, setResending] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '123456';
    const email = searchParams.get('email') || 'mahfoudh.arous@gmail.com';

    const handleVerification = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        try {
            await sendVerificationEmail({
                email,
                callbackURL: "/dashboard",
                fetchOptions: {
                    onSuccess: () => {
                        setVerified(true);
                        toast.success("Email verified successfully!");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Verification failed");
                    }
                }
            });
        } catch {
            toast.error("Verification failed");
        } finally {
            setLoading(false);
        }
    }, [token, router]);

    useEffect(() => {
        if (token) {
            handleVerification();
        }
    }, [token, handleVerification]);

    const handleResendVerification = async () => {
        if (!email) {
            toast.error("Email not found");
            return;
        }

        setResending(true);
        try {
            await resendVerificationEmail({
                email,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Verification email sent!");
                    },
                    onError: (ctx) => {
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

    if (verified) {
        return (
            <Card className="max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Email Verified!</CardTitle>
                    <CardDescription>
                        Your email has been successfully verified. Redirecting to dashboard...
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Verify Your Email</CardTitle>
                <CardDescription>
                    {token
                        ? "Verifying your email address..."
                        : "Please check your email and click the verification link to complete your registration."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {token ? (
                    <div className="text-center">
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                If verification doesn&apos;t start automatically, please wait a moment.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                            We&apos;ve sent a verification link to your email address.
                            Please check your inbox and spam folder.
                        </p>

                        {email && (
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    onClick={handleResendVerification}
                                    disabled={resending}
                                    className="w-full"
                                >
                                    {resending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resending...
                                        </>
                                    ) : (
                                        "Resend Verification Email"
                                    )}
                                </Button>
                            </div>
                        )}

                        <div className="text-center">
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/signin")}
                                className="text-sm"
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
