"use client"

import { reportDonor } from "@/actions/moderation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Flag } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ReportDialogProps {
    donorId: string
    donorName?: string
    trigger?: React.ReactNode
}

export function ReportDialog({ donorId, donorName, trigger }: ReportDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reasonType, setReasonType] = useState<string>("")
    const [description, setDescription] = useState("")

    const handleSubmit = async () => {
        if (!reasonType) {
            toast.error("Please select a reason")
            return
        }

        setLoading(true)
        try {
            const fullReason = description
                ? `${reasonType}: ${description}`
                : reasonType

            const result = await reportDonor(donorId, fullReason)

            if (result.success) {
                toast.success("Report submitted successfully")
                setOpen(false)
                setReasonType("")
                setDescription("")
            } else {
                toast.error(result.error || "Failed to submit report")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Flag className="h-4 w-4" />
                        <span className="sr-only">Report</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report User</DialogTitle>
                    <DialogDescription>
                        Report {donorName ? `${donorName}` : "this user"} if you encounter any issues.
                        This helps us keep the community safe.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Select value={reasonType} onValueChange={setReasonType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Wrong Phone Number">Wrong Phone Number</SelectItem>
                                <SelectItem value="Fake Profile">Fake Profile</SelectItem>
                                <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                                <SelectItem value="Harassment">Harassment</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Additional details (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !reasonType} variant="destructive">
                        {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
