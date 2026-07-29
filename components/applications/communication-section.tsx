"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Communication } from "@/types";
import { createCommunication } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COMM_TYPES = ["Email", "FollowUp", "Call", "LinkedIn", "Referral", "Other"];
const DIRECTIONS = ["Sent", "Received"];

interface CommunicationSectionProps {
  applicationId: string;
  communications: Communication[];
}

export function CommunicationSection({ applicationId, communications }: CommunicationSectionProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state (using simple state here instead of react-hook-form for a quick inline form)
  const [type, setType] = useState("Email");
  const [direction, setDirection] = useState("Sent");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCommunication({
        application_id: applicationId,
        type,
        direction,
        communication_date: new Date(date).toISOString(),
        subject: subject || undefined,
        content: content || undefined,
      });

      toast.success("Logged successfully");
      
      // Reset form & hide
      setSubject("");
      setContent("");
      setShowForm(false);
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      toast.error("Failed to log communication");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Communications</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? "Cancel" : "Log Activity"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Log New Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(val) => { if (val) setType(val); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COMM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select value={direction} onValueChange={(val) => { if (val) setDirection(val); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DIRECTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Subject (Optional)</Label>
                <Input placeholder="e.g. Interview Scheduling" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label>Details / Content</Label>
                <Textarea placeholder="What was said?" value={content} onChange={e => setContent(e.target.value)} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Log"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List of past communications */}
      <div className="space-y-4">
        {communications.length === 0 ? (
          <p className="text-muted-foreground text-sm">No communications logged yet.</p>
        ) : (
          communications.map((comm) => (
            <Card key={comm.id}>
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge variant={comm.direction === "Sent" ? "default" : "secondary"}>
                      {comm.direction}
                    </Badge>
                    <span className="font-semibold text-sm">{comm.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comm.communication_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {comm.subject && <div className="font-medium mt-1">{comm.subject}</div>}
                {comm.content && <div className="text-sm text-muted-foreground whitespace-pre-wrap">{comm.content}</div>}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}