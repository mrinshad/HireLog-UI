"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createRole, updateRole } from "@/lib/api";
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

const formSchema = z.object({
  company_id: z.string().min(1, "Please select a company"),
  title: z.string().min(1, "Role title is required"),
  job_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type RoleFormValues = z.infer<typeof formSchema>;

interface RoleFormProps {
  companies: Company[];
  initialData?: Role;
}

export function RoleForm({ companies, initialData }: RoleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      company_id: initialData.company_id,
      title: initialData.title,
      job_url: initialData.job_url || "",
      location: initialData.location || "",
      source: initialData.source || "",
      notes: initialData.notes || "",
    } : {
      company_id: "",
      title: "",
      job_url: "",
      location: "",
      source: "",
      notes: "",
    },
  });

  async function onSubmit(values: RoleFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        company_id: values.company_id,
        title: values.title,
        job_url: values.job_url || undefined,
        location: values.location || undefined,
        source: values.source || undefined,
        notes: values.notes || undefined,
      };

      if (initialData) {
        await updateRole(initialData.id, payload);
        toast.success("Role updated", { description: `${values.title} has been updated.` });
      } else {
        await createRole(payload);
        toast.success("Role added", { description: `${values.title} has been added.` });
      }

      router.refresh();
      router.push("/roles");
    } catch (error) {
      toast.error("Error", { description: "There was a problem saving the role." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_id">Company *</Label>
          <Controller
            control={control}
            name="company_id"
            render={({ field }) => (
              <Select onValueChange={(val) => { if (val) field.onChange(val); }} defaultValue={field.value}>
                <SelectTrigger id="company_id">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id} label={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.company_id && (
            <p className="text-sm font-medium text-destructive">{errors.company_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input id="title" placeholder="e.g. Senior Frontend Engineer" {...register("title")} />
          {errors.title && (
            <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_url">Job URL</Label>
          <Input id="job_url" placeholder="https://..." type="url" {...register("job_url")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="e.g. Remote, New York" {...register("location")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Controller
            control={control}
            name="source"
            render={({ field }) => (
              <Select onValueChange={(val) => field.onChange(val)} defaultValue={field.value || undefined}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Company Website">Company Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Indeed">Indeed</SelectItem>
                  <SelectItem value="Wellfound">Wellfound</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Any specific requirements..." className="resize-none" {...register("notes")} />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Role" : "Save Role"}
        </Button>
      </div>
    </form>
  );
}