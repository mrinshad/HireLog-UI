"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Communication } from "@/types";
import { createCommunication } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calendar, ChevronDown, ChevronUp, MessageSquare, Plus } from "lucide-react";

interface CommunicationSectionProps {
  applicationId: string;
  communications: Communication[];
}

export function CommunicationSection({
  applicationId,
  communications,
}: CommunicationSectionProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !direction) {
      toast.info("Please select type and direction");
      return;
    }
    setIsSubmitting(true);
    try {
      await createCommunication({
        application_id: applicationId,
        type,
        direction,
        subject: subject || undefined,
        content: content || undefined,
        communication_date: new Date(date).toISOString(),
      });
      toast.success("Communication logged");
      setShowForm(false);
      setType("");
      setDirection("");
      setSubject("");
      setContent("");
      setDate(new Date().toISOString().split("T")[0]);
      router.refresh();
    } catch {
      toast.error("Failed to log communication");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Communications</CardTitle>
            <CardDescription>
              {communications.length} communication{communications.length !== 1 ? "s" : ""} logged
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Log
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 border rounded-md p-4 bg-muted/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Type *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Direction *</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input type="date" className="h-9 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Subject</Label>
              <Input className="h-9 text-sm" placeholder="e.g. Follow-up on interview" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Content</Label>
              <Textarea className="text-sm resize-none" rows={2} placeholder="Details…" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {/* Communication list */}
        {communications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No communications recorded.</p>
        ) : (
          <div className="space-y-2">
            {communications.map((comm) => {
              const isExpanded = expandedId === comm.id;
              return (
                <div key={comm.id} className="rounded-md border">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : comm.id)}
                    className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                          <Badge variant={comm.direction === "Sent" ? "default" : "secondary"} className="text-xs">
                            {comm.direction}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(comm.communication_date).toLocaleDateString()}
                          </span>
                        </div>
                        {comm.subject && (
                          <p className="text-sm font-medium mt-0.5 truncate">{comm.subject}</p>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3">
                      <Separator className="mb-2" />
                      {comm.content ? (
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{comm.content}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No content recorded.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}