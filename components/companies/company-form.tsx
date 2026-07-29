"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCompany, updateCompany } from "@/lib/api";
import { Company } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  career_page_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contact_page_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  recruiter_name: z.string().optional(),
  hr_email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  other_emails: z.string().optional(),
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
  initialData?: Company; 
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      location: initialData.location || "",
      website: initialData.website || "",
      career_page_url: initialData.career_page_url || "",
      contact_page_url: initialData.contact_page_url || "",
      recruiter_name: initialData.recruiter_name || "",
      hr_email: initialData.hr_email || "",
      other_emails: initialData.other_emails || "",
      notes: initialData.notes || "",
    } : {
      name: "",
      location: "",
      website: "",
      career_page_url: "",
      contact_page_url: "",
      recruiter_name: "",
      hr_email: "",
      other_emails: "",
      notes: "",
    },
  });

  async function onSubmit(values: CompanyFormValues) {
    setIsSubmitting(true);
    try {
      const payload: Partial<Company> = {
        name: values.name,
        location: values.location || undefined,
        website: values.website || undefined,
        career_page_url: values.career_page_url || undefined,
        contact_page_url: values.contact_page_url || undefined,
        recruiter_name: values.recruiter_name || undefined,
        hr_email: values.hr_email || undefined,
        other_emails: values.other_emails || undefined,
        notes: values.notes || undefined,
      };

      if (initialData) {
        await updateCompany(initialData.id, payload);
        toast.success("Company updated", {
          description: `${values.name} has been successfully updated.`,
        });
      } else {
        await createCompany(payload);
        toast.success("Company added", {
          description: `${values.name} has been successfully added.`,
        });
      }

      router.refresh();
      router.push("/companies");
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Error", {
        description: "There was a problem saving the company. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* --- Basic Info --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" placeholder="e.g. Acme Corp" {...register("name")} />
            {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. Remote, San Francisco" {...register("location")} />
          </div>
        </div>
      </div>

      <Separator />

      {/* --- Web Links --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Web Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="website">Main Website</Label>
            <Input id="website" placeholder="https://acmecorp.com" type="url" {...register("website")} />
            {errors.website && <p className="text-sm font-medium text-destructive">{errors.website.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="career_page_url">Career Page URL</Label>
            <Input id="career_page_url" placeholder="https://acmecorp.com/careers" type="url" {...register("career_page_url")} />
            {errors.career_page_url && <p className="text-sm font-medium text-destructive">{errors.career_page_url.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contact_page_url">Contact Page URL</Label>
            <Input id="contact_page_url" placeholder="https://acmecorp.com/contact" type="url" {...register("contact_page_url")} />
            {errors.contact_page_url && <p className="text-sm font-medium text-destructive">{errors.contact_page_url.message}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* --- Contact Info --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="recruiter_name">Recruiter Name</Label>
            <Input id="recruiter_name" placeholder="e.g. Jane Doe" {...register("recruiter_name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hr_email">HR / Recruiter Email</Label>
            <Input id="hr_email" placeholder="jane.doe@acmecorp.com" type="email" {...register("hr_email")} />
            {errors.hr_email && <p className="text-sm font-medium text-destructive">{errors.hr_email.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="other_emails">Other Emails</Label>
            <Input id="other_emails" placeholder="Comma separated, e.g. jobs@acmecorp.com, info@acmecorp.com" {...register("other_emails")} />
          </div>
        </div>
      </div>

      <Separator />

      {/* --- Notes --- */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Any initial thoughts, culture notes, or connections at this company?" 
          className="resize-none min-h-[100px]" 
          {...register("notes")} 
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Company" : "Save Company"}
        </Button>
      </div>
    </form>
  );
}