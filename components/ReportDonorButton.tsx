"use client";

import { reportDonor } from "@/actions/moderation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Flag, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ReportDonorButtonProps {
    donorId: string;
    variant?: "icon" | "text";
}

const REPORT_REASONS = [
    { value: "wrong_number", label: "Wrong Number" },
    { value: "phone_off", label: "Phone Off" },
    { value: "spam_fake", label: "Spam/Fake" },
    { value: "harassment", label: "Harassment" },
] as const;

export function ReportDonorButton({ donorId, variant = "icon" }: ReportDonorButtonProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (!reason) {
            toast.error("Please select a reason for reporting");
            return;
        }

        startTransition(async () => {
            try {
                const result = await reportDonor(donorId, reason);

                if (result.success) {
                    toast.success(result.message || "Report submitted successfully");
                    setOpen(false);
                    setReason("");
                } else {
                    toast.error(result.error || "Failed to submit report");
                }
            } catch (error) {
                console.error("Error reporting donor:", error);
                toast.error("An unexpected error occurred");
            }
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setReason("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {variant === "icon" ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        title="Report donor"
                    >
                        <Flag className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-destructive" />
                        Report Donor
                    </DialogTitle>
                    <DialogDescription>
                        Please select a reason for reporting this donor. Reports help us maintain
                        the quality and safety of our platform.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Select value={reason} onValueChange={setReason} disabled={isPending}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a reason..." />
                        </SelectTrigger>
                        <SelectContent>
                            {REPORT_REASONS.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={!reason || isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Flag className="h-4 w-4 mr-2" />
                                Submit Report
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
