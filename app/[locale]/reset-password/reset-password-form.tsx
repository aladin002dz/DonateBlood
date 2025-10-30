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
import { useTranslations } from 'next-intl';

// Zod validation schema will use translations

interface ResetPasswordFormProps {
    token?: string;
}

export default function ResetPasswordForm({ token: propToken }: ResetPasswordFormProps = {}) {
    const t = useTranslations('Auth.Reset');
    const v = useTranslations('Validation');
    const resetPasswordSchema = z.object({
        password: z
            .string()
            .min(1, v('requiredPassword'))
            .min(8, v('passwordMin8'))
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                v('passwordComplex')
            ),
        confirmPassword: z
            .string()
            .min(1, v('confirmRequired')),
    }).refine((data) => data.password === data.confirmPassword, {
        message: v('passwordsMismatch'),
        path: ["confirmPassword"],
    });
    type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
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
                        <span>{t('validating')}</span>
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
                        {t('invalidTitle')}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-center">
                        {t('invalidDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{t('invalidInfo1')}</p>
                            <p className="text-sm text-muted-foreground">{t('invalidInfo2')}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col w-full space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/forgot-password">
                                {t('requestNew')}
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link href="/signin">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('backToSignIn')}
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
                        {t('successTitle')}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-center">
                        {t('successDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{t('successInfo1')}</p>
                            <p className="text-sm text-muted-foreground">{t('successInfo2')}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/signin">
                            {t('signInWithNew')}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">{t('title')}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    {t('description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('newPassword')}</Label>
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
                        <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
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
                            t('submit')
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <div className="flex justify-center w-full border-t py-4">
                    <Button asChild variant="ghost" className="text-sm">
                        <Link href="/signin">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('backToSignIn')}
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
