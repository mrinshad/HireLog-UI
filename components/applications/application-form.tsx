"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createApplication } from "@/lib/api";
import { Application, Company, Role } from "@/types";

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

const formSchema = z.object({
  role_id: z.string().min(1, "Please select a role"),
  status: z.string().min(1, "Please select a status"),
  applied_date: z.string().optional(),
  reply_received: z.boolean().optional(),
  last_reply_date: z.string().optional(),
  contact_person: z.string().optional(),
  contact_info: z.string().optional(),
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  roles: Role[];
  companies: Company[];
  initialData?: Application;
}

export function ApplicationForm({ roles, companies, initialData }: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          role_id: initialData.role_id,
          status: initialData.status,
          applied_date: initialData.applied_date
            ? new Date(initialData.applied_date).toISOString().split("T")[0]
            : "",
          reply_received: initialData.reply_received ?? false,
          last_reply_date: initialData.last_reply_date
            ? new Date(initialData.last_reply_date).toISOString().split("T")[0]
            : "",
          contact_person: initialData.contact_person || "",
          contact_info: initialData.contact_info || "",
          notes: initialData.notes || "",
        }
      : {
          role_id: "",
          status: "Interested",
          applied_date: "",
          reply_received: false,
          last_reply_date: "",
          contact_person: "",
          contact_info: "",
          notes: "",
        },
  });

  const getRoleLabel = (role: Role) => {
    const company = companies.find((c) => c.id === role.company_id);
    return `${company?.name || "Unknown"} — ${role.title}`;
  };

  async function onSubmit(values: ApplicationFormValues) {
    setIsSubmitting(true);
    try {
      const payload: Partial<Application> = {
        role_id: values.role_id,
        status: values.status,
        applied_date: values.applied_date
          ? new Date(values.applied_date).toISOString()
          : undefined,
        reply_received: values.reply_received ?? false,
        last_reply_date: values.last_reply_date
          ? new Date(values.last_reply_date).toISOString()
          : undefined,
        contact_person: values.contact_person || undefined,
        contact_info: values.contact_info || undefined,
        notes: values.notes || undefined,
      };

      await createApplication(payload);

      toast.success(
        initialData ? "Application updated" : "Application tracked",
        { description: "Your application has been saved." }
      );

      router.refresh();
      router.push("/applications");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      const isDuplicate =
        message.includes("duplicate key") ||
        message.includes("unique constraint");

      toast.error(isDuplicate ? "Already Tracked" : "Error", {
        description: isDuplicate
          ? "You are already tracking an application for this role."
          : "There was a problem saving the application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <Label htmlFor="role_id">Job Role *</Label>
          <Controller
            control={control}
            name="role_id"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!!initialData}
              >
                <SelectTrigger id="role_id">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id} label={getRoleLabel(role)}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role_id && (
            <p className="text-sm font-medium text-destructive">
              {errors.role_id.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Current Status *</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Applied Date */}
        <div className="space-y-2">
          <Label htmlFor="applied_date">Date Applied</Label>
          <Input id="applied_date" type="date" {...register("applied_date")} />
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            placeholder="e.g. Jane Smith"
            {...register("contact_person")}
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <Label htmlFor="contact_info">Contact Info</Label>
          <Input
            id="contact_info"
            placeholder="e.g. jane@company.com"
            {...register("contact_info")}
          />
        </div>

        {/* Reply Received */}
        <div className="space-y-2">
          <Label htmlFor="reply_received">Reply Received</Label>
          <div className="flex items-center gap-2 h-9">
            <input
              type="checkbox"
              id="reply_received"
              className="h-4 w-4 rounded border-border"
              {...register("reply_received")}
            />
            <Label htmlFor="reply_received" className="text-sm font-normal text-muted-foreground">
              Got a response from the company
            </Label>
          </div>
        </div>

        {/* Last Reply Date */}
        <div className="space-y-2">
          <Label htmlFor="last_reply_date">Last Reply Date</Label>
          <Input
            id="last_reply_date"
            type="date"
            {...register("last_reply_date")}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any initial thoughts, recruiter names, or interview prep?"
          className="resize-none"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Application"
            : "Start Tracking"}
        </Button>
      </div>
    </form>
  );
}