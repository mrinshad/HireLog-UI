import { getRoles, getCompanies } from "@/lib/api";
import { ApplicationForm } from "@/components/applications/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function NewApplicationPage() {
  const [roles, companies] = await Promise.all([
    getRoles(),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Track New Application</CardTitle>
          <CardDescription>
            Select a job role and update your current stage in the process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                You need to add a Job Role before you can track an application.
              </p>
              <Link href="/roles/new" className={buttonVariants({ variant: "default" })}>
                Add a Role First
              </Link>
            </div>
          ) : (
            <ApplicationForm roles={roles} companies={companies} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}