import { getCompany } from "@/lib/api";
import { CompanyForm } from "@/components/companies/company-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompanyPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // ✅ Now we only fetch the exact company we need
  const company = await getCompany(resolvedParams.id);

  // If the backend returns 404 (mapped to null in our API utility), trigger a Next.js 404 page
  if (!company) {
    return notFound();
  }

  return (
    <main className="container mx-auto py-10 max-w-2xl">
      <Breadcrumbs items={[{ label: "Companies", href: "/companies" }, { label: "Edit Company" }]} />
      <Card>
        <CardHeader>
          <CardTitle>Edit Company</CardTitle>
          <CardDescription>
            Update details for {company.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* We pass the cleanly fetched single company as initialData */}
          <CompanyForm initialData={company} />
        </CardContent>
      </Card>
    </main>
  );
}