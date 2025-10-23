"use client";

import { requestPasswordReset } from "@/actions/password-reset";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Zod validation schema
const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);

        try {
            const result = await requestPasswordReset(data.email);

            if (result.success) {
                setEmailSent(true);
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Password reset request error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <Card className="z-50 rounded-md rounded-t-none max-w-md">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl text-center">
                        Check Your Email
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-center">
                        We&apos;ve sent you a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                We&apos;ve sent a password reset link to your email address.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Please check your inbox and follow the instructions to reset your password.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                The link will expire in 1 hour for security reasons.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col w-full space-y-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setEmailSent(false)}
                        >
                            Send Another Email
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link href="/signin">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Sign In
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Forgot Password</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email address and we&apos;ll send you a link to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !isValid}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <div className="flex justify-center w-full border-t py-4">
                    <Button asChild variant="ghost" className="text-sm">
                        <Link href="/signin">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
