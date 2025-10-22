"use client";

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
import { signIn } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Zod validation schema
const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, "Email or phone number is required")
        .refine(
            (value) => {
                // Check if it's a valid email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) return true;

                // Check if it's a valid phone number (more flexible regex)
                const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{8,14}|\d{8,15})$/;
                return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
            },
            {
                message: "Please enter a valid email address or phone number (e.g., +1234567890)",
            }
        ),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
                                const errorMessage = ctx.error?.message || 'An error occurred during sign-in';

                                toast.error(errorMessage);

                                setLoading(false);
                            },
                            onSuccess: async () => {
                                toast.success('Signed in successfully');
                                router.push("/profile");
                            },
                        },
                    });
                } catch (error) {
                    console.error("Email sign-in error:", error);
                    toast.error('An error occurred during email sign-in');
                    setLoading(false);
                }
            } else {
                // Use custom sign-in for phone number
                try {
                    const response = await fetch('/api/auth/custom-signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            identifier: data.identifier,
                            password: data.password,
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        toast.success('Signed in successfully');
                        // Refresh the page to update the session state
                        window.location.href = result.redirect || "/profile";
                    } else {
                        // Show specific error message based on the error type
                        const errorMessage = result.error || 'Invalid credentials';
                        if (errorMessage === 'Incorrect password') {
                            toast.error('Incorrect password');
                        } else if (errorMessage === 'User not found') {
                            toast.error('User not found');
                        } else {
                            toast.error(errorMessage);
                        }
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Phone sign-in error:', error);
                    toast.error('Network error. Please check your connection and try again.');
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            toast.error('An error occurred during sign-in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="z-50 rounded-md rounded-t-none max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" >
                        <div className="grid gap-2">
                            <Label htmlFor="identifier">Email or Phone Number</Label>
                            <Input
                                id="identifier"
                                type="text"
                                placeholder="m@example.com or +1234567890"
                                {...register("identifier")}
                            />
                            {errors.identifier && (
                                <p className="text-sm text-destructive">{errors.identifier.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Password"
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
                                "Sign In"
                            )}
                        </Button>
                    </ form >

                    {/* Divider */}
                    <div className="relative" >
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
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
                                    toast.error('An error occurred during Google sign-in');
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
                            Continue with Google
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
                            Continue with GitHub
                        </Button>
                    </div>
                </div >
            </CardContent >
            <CardFooter>
                <div className="flex justify-center w-full border-t py-4">
                    <p className="text-center text-xs text-muted-foreground">
                        Secured by <span className="text-primary">better-auth.</span>
                    </p>
                </div>
            </CardFooter>
        </Card >
    );
}