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
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

interface ReportDialogProps {
    donorId: string
    donorName?: string
    trigger?: React.ReactNode
}

export function ReportDialog({ donorId, donorName, trigger }: ReportDialogProps) {
    const t = useTranslations('Report')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reasonType, setReasonType] = useState<string>("")
    const [description, setDescription] = useState("")

    const handleSubmit = async () => {
        if (!reasonType) {
            toast.error(t('toast.selectReason'))
            return
        }

        setLoading(true)
        try {
            const fullReason = description
                ? `${reasonType}: ${description}`
                : reasonType

            const result = await reportDonor(donorId, fullReason)

            if (result.success) {
                toast.success(t('toast.success'))
                setOpen(false)
                setReasonType("")
                setDescription("")
            } else {
                toast.error(result.error || t('toast.fail'))
            }
        } catch (error) {
            toast.error(t('toast.error'))
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
                        <span className="sr-only">{t('triggerLabel')}</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description', { name: donorName || t('thisUser') })}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Select value={reasonType} onValueChange={setReasonType}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('selectReason')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Wrong Phone Number">{t('reasons.wrongPhone')}</SelectItem>
                                <SelectItem value="Fake Profile">{t('reasons.fakeProfile')}</SelectItem>
                                <SelectItem value="Inappropriate Content">{t('reasons.inappropriateContent')}</SelectItem>
                                <SelectItem value="Harassment">{t('reasons.harassment')}</SelectItem>
                                <SelectItem value="Other">{t('reasons.other')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder={t('additionalDetails')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !reasonType} variant="destructive">
                        {loading ? t('submitting') : t('submit')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
