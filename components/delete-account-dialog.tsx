"use client";

import { deleteAccount } from "@/actions/delete-account";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
    children: React.ReactNode;
}

export function DeleteAccountDialog({ children }: DeleteAccountDialogProps) {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const expectedText = "DELETE";
    const isConfirmValid = confirmText === expectedText;

    const handleDelete = async () => {
        if (!isConfirmValid) {
            toast.error("Please type 'DELETE' to confirm");
            return;
        }

        try {
            setIsDeleting(true);
            const result = await deleteAccount();

            if (result.success) {
                toast.success("Account deleted successfully");
                setOpen(false);
                // Redirect to home page after successful deletion
                router.push("/");
            } else {
                toast.error(result.error || "Failed to delete account");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("An error occurred while deleting your account");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm font-medium text-destructive mb-2">
                                What will be deleted:
                            </p>
                            <ul className="text-sm text-destructive/80 space-y-1">
                                <li>• Your profile information</li>
                                <li>• Your blood donation history</li>
                                <li>• Your availability status</li>
                                <li>• All associated sessions</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-delete" className="text-sm font-medium">
                                To confirm, type <span className="font-mono bg-muted px-1 rounded">DELETE</span> in the box below:
                            </Label>
                            <Input
                                id="confirm-delete"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Type DELETE to confirm"
                                className="font-mono"
                                disabled={isDeleting}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={!isConfirmValid || isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
