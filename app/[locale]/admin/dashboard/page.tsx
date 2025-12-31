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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { Check, Home, Loader2, Shield, Ban, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
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
    const { data: session, isPending: sessionPending } = useSession();
    const router = useRouter();
    const [donors, setDonors] = useState<FlaggedDonor[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

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
                toast.error("Failed to load flagged donors");
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
                toast.success("Donor approved successfully");
                // Refresh the list
                setDonors((prev) => prev.filter((d) => d.id !== donorId));
            } else {
                toast.error(result.error || "Failed to approve donor");
            }
        });
    };

    const handleBan = async (donorId: string) => {
        startTransition(async () => {
            const result = await updateDonorStatus(donorId, "banned");
            if (result.success) {
                toast.success("Donor banned successfully");
                // Update the list
                setDonors((prev) =>
                    prev.map((d) =>
                        d.id === donorId ? { ...d, status: "banned" as const } : d
                    )
                );
            } else {
                toast.error(result.error || "Failed to ban donor");
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
                return <Badge variant="default">Active</Badge>;
            case "hidden":
                return <Badge variant="secondary">Hidden</Badge>;
            case "banned":
                return <Badge variant="destructive">Banned</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-purple-500 hover:bg-purple-600">Admin</Badge>;
            case "moderator":
                return <Badge className="bg-blue-500 hover:bg-blue-600">Moderator</Badge>;
            default:
                return <Badge variant="outline">User</Badge>;
        }
    };

    if (sessionPending || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading admin dashboard...</p>
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
                            <span className="text-sm">Back to Home</span>
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
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Manage flagged donors and moderate content.
                    </p>
                </div>

                {/* Flagged Donors Table */}
                <Tabs defaultValue="donors" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="donors">Flagged Donors</TabsTrigger>
                        <TabsTrigger value="reports">All Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="donors">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    Flagged Donors
                                </CardTitle>
                                <CardDescription>
                                    Donors with hidden status or reports. Review and take action.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {donors.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                        <p className="text-lg font-medium">All clear!</p>
                                        <p className="text-sm">No flagged donors to review.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Donor Name</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Report Count</TableHead>
                                                <TableHead>Owner Role</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
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
                                                                Approve
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
                                                                Ban
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    All Reports
                                </CardTitle>
                                <CardDescription>
                                    Detailed view of all submitted reports.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {reports.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p className="text-lg font-medium">No reports found.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Reporter</TableHead>
                                                <TableHead>Donor</TableHead>
                                                <TableHead>Reason</TableHead>
                                                <TableHead>Status</TableHead>
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
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
