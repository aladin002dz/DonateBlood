"use client";

import Link from "next/link";

import { customSignIn } from "@/actions/signin";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useTranslations } from 'next-intl';

// Zod validation schema will be defined inside the component to use translations

export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const t = useTranslations('Auth.SignIn');
    const v = useTranslations('Validation');

    const signInSchema = z.object({
        identifier: z
            .string()
            .min(1, v('requiredIdentifier'))
            .refine(
                (value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(value)) return true;
                    const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{8,14}|\d{8,15})$/;
                    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
                },
                { message: v('identifierInvalid') }
            ),
        password: z
            .string()
            .min(1, v('requiredPassword'))
            .min(6, v('minPassword6')),
    });

    type SignInFormData = z.infer<typeof signInSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        mode: "onChange",
    });


    const onSubmit = async (data: SignInFormData) => {
        setLoading(true);

        try {
            // Check if identifier is email or phone number
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);

            if (isEmail) {
                // Use email sign-in directly with Better Auth
                try {
                    await signIn.email({
                        email: data.identifier,
                        password: data.password,
                        callbackURL: "/profile",
                        fetchOptions: {
                            onError: (ctx) => {
                                console.error("Sign-in error:", ctx);
                                console.error("Error message:", ctx.error?.message);

                                // Get the error message safely
                                const errorMessage = ctx.error?.message || t('toastGeneric');

                                toast.error(errorMessage);

                                setLoading(false);
                            },
                            onSuccess: async () => {
                                toast.success(t('toastSuccess'));
                                router.push("/profile");
                            },
                        },
                    });
                } catch (error) {
                    console.error("Email sign-in error:", error);
                    toast.error(t('toastGeneric'));
                    setLoading(false);
                }
            } else {
                // Use custom sign-in for phone number
                try {
                    const result = await customSignIn(data.identifier, data.password);

                    if (result.error) {
                        // Show specific error message based on the error type
                        const errorMessage = result.error;
                        if (errorMessage === 'Incorrect password') {
                            toast.error(t('errorIncorrectPassword'));
                        } else if (errorMessage === 'User not found') {
                            toast.error(t('errorUserNotFound'));
                        } else {
                            toast.error(errorMessage);
                        }
                        setLoading(false);
                    } else {
                        toast.success(t('toastSuccess'));
                        // Refresh the page to update the session state
                        window.location.href = result.redirect || "/profile";
                    }
                } catch (error) {
                    console.error('Phone sign-in error:', error);
                    toast.error(t('toastNetwork'));
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            toast.error(t('toastGeneric'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">{t('title')}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    {t('description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" >
                        <div className="grid gap-2">
                            <Label htmlFor="identifier">{t('identifierLabel')}</Label>
                            <Input
                                id="identifier"
                                type="text"
                                placeholder={t('identifierPlaceholder')}
                                {...register("identifier")}
                            />
                            {errors.identifier && (
                                <p className="text-sm text-destructive">{errors.identifier.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('passwordLabel')}</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder={t('passwordPlaceholder')}
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
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

                    {/* Forgot Password Link */}
                    <div className="text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-muted-foreground hover:text-primary underline"
                        >
                            {t('forgot')}
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="relative" >
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                {t('continueWith')}
                            </span>
                        </div>
                    </div>
                    {/* Social Login Buttons */}
                    <div className="grid gap-2" >
                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await signIn.social({
                                        provider: "google",
                                        callbackURL: "/profile",
                                        fetchOptions: {
                                            onError: (ctx) => {
                                                toast.error(ctx.error.message);
                                                setLoading(false);
                                            },
                                            onSuccess: async () => {
                                                router.push("/profile");
                                            },
                                        },
                                    });
                                } catch (error) {
                                    console.error('Google sign-in error:', error);
                                    toast.error(t('toastGoogle'));
                                    setLoading(false);
                                }
                            }}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            {t('continueGoogle')}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await signIn.social({
                                        provider: "github",
                                        callbackURL: "/profile",
                                        fetchOptions: {
                                            onError: (ctx) => {
                                                toast.error(ctx.error.message);
                                                setLoading(false);
                                            },
                                            onSuccess: async () => {
                                                router.push("/profile");
                                            },
                                        },
                                    });
                                } catch (error) {
                                    console.error('GitHub sign-in error:', error);
                                    toast.error('An error occurred during GitHub sign-in');
                                    setLoading(false);
                                }
                            }}
                        >
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            {t('continueGithub')}
                        </Button>
                    </div>
                </div >
            </CardContent >
        </Card >
    );
}