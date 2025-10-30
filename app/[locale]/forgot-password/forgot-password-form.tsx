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
import { useTranslations } from 'next-intl';

// Zod validation schema will use translations

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const t = useTranslations('Auth.Forgot');
    const v = useTranslations('Validation');

    const forgotPasswordSchema = z.object({
        email: z
            .string()
            .min(1, v('emailRequired'))
            .email(v('emailInvalid')),
    });
    type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

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
            toast.error(t('toastGeneric'));
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl text-center">
                    {t('sentTitle')}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-center">
                    {t('sentDescription')}
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
                            <p className="text-sm text-muted-foreground">{t('sentInfo1')}</p>
                            <p className="text-sm text-muted-foreground">{t('sentInfo2')}</p>
                            <p className="text-xs text-muted-foreground">{t('sentInfo3')}</p>
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
                            {t('sendAnother')}
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
                        <Label htmlFor="email">{t('emailLabel')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
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
