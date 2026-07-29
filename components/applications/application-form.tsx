"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createApplication } from "@/lib/api";
import { Company, Role } from "@/types";

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
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  roles: Role[];
  companies: Company[];
}

export function ApplicationForm({ roles, companies }: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role_id: "",
      status: "Interested", // Default status
      applied_date: "",
      notes: "",
    },
  });

  // Helper to format the dropdown labels
  const getRoleLabel = (role: Role) => {
    const company = companies.find((c) => c.id === role.company_id);
    const companyName = company ? company.name : "Unknown";
    return `${companyName} — ${role.title}`;
  };

  async function onSubmit(values: ApplicationFormValues) {
    setIsSubmitting(true);
    try {
      // Format the date properly for Go's time.Time if it exists
      let formattedDate = undefined;
      if (values.applied_date) {
        formattedDate = new Date(values.applied_date).toISOString();
      }

      await createApplication({
        role_id: values.role_id,
        status: values.status,
        applied_date: formattedDate,
        notes: values.notes || undefined,
      });

      toast.success("Application tracked", {
        description: "Your application has been successfully saved.",
      });

      router.refresh();
      router.push("/applications");
    } catch (error: any) {
      console.error("Failed to submit form:", error);
      
      // If we hit the UNIQUE constraint on role_id, the database will throw an error
      const isDuplicate = error.message.includes("duplicate key") || error.message.includes("unique constraint");
      
      toast.error(isDuplicate ? "Already Tracked" : "Error", {
        description: isDuplicate 
          ? "You are already tracking an application for this specific role."
          : "There was a problem saving the application. Please try again.",
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="role_id">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role_id && (
            <p className="text-sm font-medium text-destructive">{errors.role_id.message}</p>
          )}
        </div>

        {/* Status Selection */}
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
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          <Input 
            id="applied_date" 
            type="date" 
            {...register("applied_date")} 
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
          {isSubmitting ? "Saving..." : "Start Tracking"}
        </Button>
      </div>
    </form>
  );
}