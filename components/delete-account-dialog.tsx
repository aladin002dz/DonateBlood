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
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
    children: React.ReactNode;
}

export function DeleteAccountDialog({ children }: DeleteAccountDialogProps) {
    const t = useTranslations("DeleteAccount");
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const expectedText = t("confirmText");
    const isConfirmValid = confirmText === expectedText;

    // Reset confirm text when dialog closes
    useEffect(() => {
        if (!open) {
            setConfirmText("");
        }
    }, [open]);

    const handleDelete = async () => {
        if (!isConfirmValid) {
            toast.error(t("toastConfirmRequired"));
            return;
        }

        try {
            setIsDeleting(true);
            const result = await deleteAccount();

            if (result.success) {
                toast.success(t("toastSuccess"));
                setOpen(false);
                // Refresh the page to clear session state and redirect to home
                // The server already signs out the user, so we just need to refresh
                window.location.href = "/";
            } else {
                toast.error(result.error || t("toastError"));
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error(t("toastGenericError"));
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
                        {t("title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            {t("description")}
                        </p>
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-sm font-medium text-destructive mb-2">
                                {t("whatWillBeDeleted")}
                            </p>
                            <ul className="text-sm text-destructive/80 space-y-1">
                                <li>• {t("profileInfo")}</li>
                                <li>• {t("donationHistory")}</li>
                                <li>• {t("availabilityStatus")}</li>
                                <li>• {t("associatedSessions")}</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-delete" className="text-sm font-medium">
                                {t("confirmLabel")} <span className="font-mono bg-muted px-1 rounded">{t("confirmText")}</span> {t("confirmLabelInBox")}
                            </Label>
                            <Input
                                id="confirm-delete"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder={t("confirmPlaceholder")}
                                className="font-mono"
                                disabled={isDeleting}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        {t("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={!isConfirmValid || isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {t("deleting")}
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("deleteButton")}
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
