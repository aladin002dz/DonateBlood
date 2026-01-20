"use client";

import { getFlaggedDonors, updateDonorStatus, getAllReports } from "@/actions/moderation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Check, Home, Loader2, Shield, Ban, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition, Activity } from "react";
import { toast } from "sonner";

type FlaggedDonor = {
    id: string;
    userId: string;
    status: "active" | "hidden" | "banned";
    reportCount: number;
    ownerName: string;
    ownerPhone: string | null;
    ownerRole: "user" | "moderator" | "admin";
};

type Report = {
    id: string;
    reason: string;
    status: "pending" | "reviewed" | "resolved" | "dismissed";
    createdAt: Date;
    reporterName: string;
    donorId: string;
    donorName: string;
};

export default function AdminDashboard() {
    const t = useTranslations('Admin');
    const { data: session, isPending: sessionPending } = useSession();
    const router = useRouter();
    const [donors, setDonors] = useState<FlaggedDonor[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState("donors");

    // Check user role and redirect if not admin/moderator
    useEffect(() => {
        if (!sessionPending && session) {
            const userRole = (session.user as { role?: string }).role || "user";
            if (userRole !== "admin" && userRole !== "moderator") {
                router.push("/");
            }
        } else if (!sessionPending && !session) {
            router.push("/signin");
        }
    }, [session, sessionPending, router]);

    // Fetch flagged donors
    useEffect(() => {
        async function fetchDonors() {
            try {
                const result = await getFlaggedDonors();
                if (result.success && result.donors) {
                    setDonors(result.donors as FlaggedDonor[]);
                    setCurrentUserRole(result.currentUserRole || "");
                }

                const reportsResult = await getAllReports();
                if (reportsResult.success && reportsResult.reports) {
                    setReports(reportsResult.reports as Report[]);
                }
            } catch (error) {
                console.error("Error fetching donors:", error);
                toast.error(t('Actions.toast.loadError'));
            } finally {
                setIsLoading(false);
            }
        }

        if (session) {
            fetchDonors();
        }
    }, [session]);

    const handleApprove = async (donorId: string) => {
        startTransition(async () => {
            const result = await updateDonorStatus(donorId, "active");
            if (result.success) {
                toast.success(t('Actions.toast.approveSuccess'));
                // Refresh the list
                setDonors((prev) => prev.filter((d) => d.id !== donorId));
            } else {
                toast.error(result.error || t('Actions.toast.approveError'));
            }
        });
    };

    const handleBan = async (donorId: string) => {
        startTransition(async () => {
            const result = await updateDonorStatus(donorId, "banned");
            if (result.success) {
                toast.success(t('Actions.toast.banSuccess'));
                // Update the list
                setDonors((prev) =>
                    prev.map((d) =>
                        d.id === donorId ? { ...d, status: "banned" as const } : d
                    )
                );
            } else {
                toast.error(result.error || t('Actions.toast.banError'));
            }
        });
    };

    // Check if buttons should be disabled based on hierarchy
    const shouldDisableButtons = (ownerRole: string): boolean => {
        if (currentUserRole === "admin") {
            return false; // Admins can always act
        }
        // Moderators cannot act on admin-owned donors
        if (currentUserRole === "moderator" && ownerRole === "admin") {
            return true;
        }
        // Moderators cannot act on other moderators' donors
        if (currentUserRole === "moderator" && ownerRole === "moderator") {
            return true;
        }
        return false;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge variant="default">{t('Status.active')}</Badge>;
            case "hidden":
                return <Badge variant="secondary">{t('Status.hidden')}</Badge>;
            case "banned":
                return <Badge variant="destructive">{t('Status.banned')}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-purple-500 hover:bg-purple-600">{t('Roles.admin')}</Badge>;
            case "moderator":
                return <Badge className="bg-blue-500 hover:bg-blue-600">{t('Roles.moderator')}</Badge>;
            default:
                return <Badge variant="outline">{t('Roles.user')}</Badge>;
        }
    };

    if (sessionPending || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">{t('Dashboard.loading')}</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect to signin
    }

    const userRole = (session.user as { role?: string }).role || "user";
    if (userRole !== "admin" && userRole !== "moderator") {
        return null; // Will redirect to home
    }

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
                            <span className="text-sm">{t('Dashboard.backToHome')}</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {getRoleBadge(userRole)}
                    </div>
                </div>

                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Shield className="h-10 w-10 text-primary" />
                        {t('Dashboard.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('Dashboard.subtitle')}
                    </p>
                </div>

                {/* Flagged Donors Table */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="donors">{t('Dashboard.tabs.donors')}</TabsTrigger>
                        <TabsTrigger value="reports">{t('Dashboard.tabs.reports')}</TabsTrigger>
                    </TabsList>

                    <Activity mode={activeTab === 'donors' ? 'visible' : 'hidden'}>
                        <div role="tabpanel" className="flex-1 outline-none" data-slot="tabs-content" hidden={activeTab !== 'donors'}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                        {t('FlaggedDonors.title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('FlaggedDonors.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {donors.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                            <p className="text-lg font-medium">{t('FlaggedDonors.emptyState.title')}</p>
                                            <p className="text-sm">{t('FlaggedDonors.emptyState.description')}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Desktop View */}
                                            <div className="hidden md:block">
                                                <ScrollArea className="h-[calc(100vh-220px)] rounded-md border">
                                                    <table className="w-full caption-bottom text-sm text-left">
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t('FlaggedDonors.columns.donorName')}</TableHead>
                                                                <TableHead>{t('FlaggedDonors.columns.phone')}</TableHead>
                                                                <TableHead>{t('FlaggedDonors.columns.status')}</TableHead>
                                                                <TableHead>{t('FlaggedDonors.columns.reportCount')}</TableHead>
                                                                <TableHead>{t('FlaggedDonors.columns.ownerRole')}</TableHead>
                                                                <TableHead className="text-right">{t('FlaggedDonors.columns.actions')}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {donors.map((donor) => (
                                                                <TableRow key={donor.id}>
                                                                    <TableCell className="font-medium">
                                                                        {donor.ownerName}
                                                                    </TableCell>
                                                                    <TableCell>{donor.ownerPhone || "N/A"}</TableCell>
                                                                    <TableCell>{getStatusBadge(donor.status)}</TableCell>
                                                                    <TableCell>
                                                                        <span
                                                                            className={`font-medium ${donor.reportCount >= 3
                                                                                ? "text-red-500"
                                                                                : donor.reportCount > 0
                                                                                    ? "text-yellow-500"
                                                                                    : ""
                                                                                }`}
                                                                        >
                                                                            {donor.reportCount}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>{getRoleBadge(donor.ownerRole)}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                                onClick={() => handleApprove(donor.id)}
                                                                                disabled={
                                                                                    isPending ||
                                                                                    shouldDisableButtons(donor.ownerRole)
                                                                                }
                                                                            >
                                                                                <Check className="h-4 w-4 mr-1" />
                                                                                {t('Actions.approve')}
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                onClick={() => handleBan(donor.id)}
                                                                                disabled={
                                                                                    isPending ||
                                                                                    donor.status === "banned" ||
                                                                                    shouldDisableButtons(donor.ownerRole)
                                                                                }
                                                                            >
                                                                                <Ban className="h-4 w-4 mr-1" />
                                                                                {t('Actions.ban')}
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </table>
                                                </ScrollArea>
                                            </div>

                                            {/* Mobile View */}
                                            <div className="md:hidden space-y-4">
                                                {donors.map((donor) => (
                                                    <div key={donor.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <div className="font-semibold">{donor.ownerName}</div>
                                                                <div className="text-sm text-muted-foreground">{donor.ownerPhone || "N/A"}</div>
                                                            </div>
                                                            <div>{getStatusBadge(donor.status)}</div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-muted-foreground">{t('FlaggedDonors.columns.reportCount')}</span>
                                                                <span
                                                                    className={`font-medium ${donor.reportCount >= 3
                                                                        ? "text-red-500"
                                                                        : donor.reportCount > 0
                                                                            ? "text-yellow-500"
                                                                            : ""
                                                                        }`}
                                                                >
                                                                    {donor.reportCount}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-muted-foreground">{t('FlaggedDonors.columns.ownerRole')}</span>
                                                                <div>{getRoleBadge(donor.ownerRole)}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={() => handleApprove(donor.id)}
                                                                disabled={
                                                                    isPending ||
                                                                    shouldDisableButtons(donor.ownerRole)
                                                                }
                                                            >
                                                                <Check className="h-4 w-4 mr-1" />
                                                                {t('Actions.approve')}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => handleBan(donor.id)}
                                                                disabled={
                                                                    isPending ||
                                                                    donor.status === "banned" ||
                                                                    shouldDisableButtons(donor.ownerRole)
                                                                }
                                                            >
                                                                <Ban className="h-4 w-4 mr-1" />
                                                                {t('Actions.ban')}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </Activity>

                    <Activity mode={activeTab === 'reports' ? 'visible' : 'hidden'}>
                        <div role="tabpanel" className="flex-1 outline-none" data-slot="tabs-content" hidden={activeTab !== 'reports'}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        {t('Reports.title')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('Reports.description')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {reports.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <p className="text-lg font-medium">{t('Reports.emptyState')}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Desktop View */}
                                            <div className="hidden md:block">
                                                <ScrollArea className="h-[calc(100vh-220px)] rounded-md border">
                                                    <table className="w-full caption-bottom text-sm text-left">
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t('Reports.columns.date')}</TableHead>
                                                                <TableHead>{t('Reports.columns.reporter')}</TableHead>
                                                                <TableHead>{t('Reports.columns.donor')}</TableHead>
                                                                <TableHead>{t('Reports.columns.reason')}</TableHead>
                                                                <TableHead>{t('Reports.columns.status')}</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {reports.map((report) => (
                                                                <TableRow key={report.id}>
                                                                    <TableCell>
                                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                                    </TableCell>
                                                                    <TableCell>{report.reporterName}</TableCell>
                                                                    <TableCell>{report.donorName}</TableCell>
                                                                    <TableCell>{report.reason}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline">{report.status}</Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </table>
                                                </ScrollArea>
                                            </div>

                                            {/* Mobile View */}
                                            <div className="md:hidden space-y-4">
                                                {reports.map((report) => (
                                                    <div key={report.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="text-sm text-muted-foreground">
                                                                {new Date(report.createdAt).toLocaleDateString()}
                                                            </div>
                                                            <Badge variant="outline">{report.status}</Badge>
                                                        </div>

                                                        <div className="space-y-2 mb-2">
                                                            <div>
                                                                <span className="text-xs text-muted-foreground uppercase font-semibold">{t('Reports.mobileLabels.reason')}</span>
                                                                <p className="text-sm">{report.reason}</p>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground uppercase font-semibold">{t('Reports.mobileLabels.reporter')}</span>
                                                                    <p>{report.reporterName}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground uppercase font-semibold">{t('Reports.mobileLabels.reportedDonor')}</span>
                                                                    <p>{report.donorName}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </Activity>
                </Tabs>
            </div>
        </div>
    );
}
