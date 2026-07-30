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
import { ArrowRight } from "lucide-react";

const STATUSES = [
  "Interested",
  "Planned",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
  "Withdrawn",
];

interface UpdateStatusFormProps {
  applicationId: string;
  currentStatus: string;
}

export function UpdateStatusForm({
  applicationId,
  currentStatus,
}: UpdateStatusFormProps) {
  const router = useRouter();
  const currentIdx = STATUSES.indexOf(currentStatus);

  // Only allow statuses that come after the current one.
  // Always allow terminal statuses (Rejected, Ghosted, Withdrawn) from any position.
  const allowedStatuses = STATUSES.filter((s, i) => {
    if (s === currentStatus) return false;
    // Terminal statuses are always reachable
    if (["Rejected", "Ghosted", "Withdrawn"].includes(s)) return true;
    // Otherwise only forward
    return i > currentIdx;
  });

  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the current status is terminal, no further updates
  const isTerminal = ["Offer", "Rejected", "Ghosted", "Withdrawn"].includes(
    currentStatus
  );

  if (isTerminal) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!status) {
      toast.info("Please select a new status");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateApplicationStatus(
        applicationId,
        status,
        notes || undefined
      );
      toast.success("Status Updated", {
        description: `Application moved to ${status}.`,
      });
      setStatus("");
      setNotes("");
      router.refresh();
    } catch {
      toast.error("Error updating status", { description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
      <h3 className="font-semibold text-base flex items-center gap-2">
        <ArrowRight className="h-4 w-4" />
        Advance Status
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Next Status</Label>
          <Select value={status} onValueChange={(val) => { if (val) setStatus(val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select next status" />
            </SelectTrigger>
            <SelectContent>
              {allowedStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Notes (Optional)</Label>
          <Textarea
            placeholder="e.g. Scheduled for Tuesday…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={2}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || !status} className="w-full sm:w-auto">
        {isSubmitting ? "Updating…" : "Update Status"}
      </Button>
    </form>
  );
}