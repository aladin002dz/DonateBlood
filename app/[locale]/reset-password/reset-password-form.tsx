"use client";

import { resetPassword, validateResetToken } from "@/actions/password-reset";
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
import { ArrowLeft, CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Zod validation schema
const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    token?: string;
}

export default function ResetPasswordForm({ token: propToken }: ResetPasswordFormProps = {}) {
    const searchParams = useSearchParams();
    const token = propToken || searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
    });

    useEffect(() => {
        const validateToken = async () => {
            console.log('Validating token:', token);
            if (!token) {
                console.log('No token provided');
                setValidating(false);
                return;
            }

            try {
                const result = await validateResetToken(token);
                console.log('Token validation result:', result);
                setTokenValid(result.valid);
                if (!result.valid) {
                    toast.error(result.error);
                }
            } catch (error) {
                console.error('Token validation error:', error);
                toast.error('Failed to validate reset token');
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(token, data.password);

            if (result.success) {
                setPasswordReset(true);
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <Card className="z-50 rounded-md rounded-t-none max-w-md">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Validating reset token...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!token || !tokenValid) {
        return (
            <Card className="z-50 rounded-md rounded-t-none max-w-md">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl text-center">
                        Invalid Reset Link
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-center">
                        This password reset link is invalid or has expired
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                This password reset link is either invalid or has expired.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Please request a new password reset link.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col w-full space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/forgot-password">
                                Request New Reset Link
                            </Link>
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

    if (passwordReset) {
        return (
            <Card className="z-50 rounded-md rounded-t-none max-w-md">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl text-center">
                        Password Reset Successfully
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-center">
                        Your password has been updated
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Your password has been successfully reset.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You can now sign in with your new password.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/signin">
                            Sign In with New Password
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your new password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
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
                            "Reset Password"
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
