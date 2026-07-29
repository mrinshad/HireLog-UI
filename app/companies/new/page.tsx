import { CompanyForm } from "@/components/companies/company-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCompanyPage() {
  return (
    <main className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Company</CardTitle>
          <CardDescription>
            Enter the details of the company you want to track.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm />
        </CardContent>
      </Card>
    </main>
  );
}