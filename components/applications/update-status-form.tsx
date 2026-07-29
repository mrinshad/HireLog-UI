"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const STATUSES = [
    "Interested", "Planned", "Applied", "Screening",
    "Interview", "Offer", "Rejected", "Ghosted", "Withdrawn"
];

interface UpdateStatusFormProps {
    applicationId: string;
    currentStatus: string;
}

export function UpdateStatusForm({ applicationId, currentStatus }: UpdateStatusFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (status === currentStatus && !notes) {
            toast.info("No changes made");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateApplicationStatus(applicationId, status, notes || undefined);
            toast.success("Status Updated", {
                description: `Application moved to ${status}.`,
            });
            setNotes(""); // Clear notes after submission
            router.refresh(); // Tell Next.js to re-fetch the server page
        } catch (error) {
            toast.error("Error updating status", { description: "Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6 border-t pt-6">
            <h3 className="font-semibold text-lg">Update Status</h3>

            <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={status} onValueChange={(val) => { if (val) setStatus(val) }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Status Notes (Optional)</Label>
                <Textarea
                    placeholder="e.g. Scheduled for next Tuesday..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
        </form>
    );
}