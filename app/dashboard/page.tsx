"use client";

import EmailVerificationBanner from "@/components/email-verification-banner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "@/lib/auth-client";
import { Calendar, Home, Loader2, LogOut, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/signin");
        }
    }, [session, isPending, router]);

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect to signin
    }

    const user = session.user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            <span className="text-sm">Back to Home</span>
                        </Link>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                {/* Email Verification Banner */}
                <EmailVerificationBanner />

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user.name || user.email}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Here&apos;s your account overview and information.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Your personal account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-lg">
                                        {user.name
                                            ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
                                            : user.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">
                                        {user.name || "No name set"}
                                    </h3>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </p>
                                    {user.emailVerified && (
                                        <Badge variant="secondary" className="mt-2">
                                            Email Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        User ID
                                    </label>
                                    <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">
                                        {user.id}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Account Created
                                    </label>
                                    <p className="text-sm flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Manage your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                Edit Profile
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                Security Settings
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                Notification Preferences
                            </Button>
                            <Separator />
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Stats */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Statistics</CardTitle>
                            <CardDescription>
                                Your account activity and information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">
                                        {user.emailVerified ? "✓" : "⚠"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Email Status
                                    </div>
                                    <div className="text-xs mt-1">
                                        {user.emailVerified ? "Verified" : "Unverified"}
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">
                                        {user.name ? "✓" : "⚠"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Display Name
                                    </div>
                                    <div className="text-xs mt-1">
                                        {user.name ? "Set" : "Not set"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
