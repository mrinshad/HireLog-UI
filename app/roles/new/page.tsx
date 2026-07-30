import { getCompanies } from "@/lib/api";
import { RoleForm } from "@/components/roles/role-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default async function NewRolePage() {
  const companies = await getCompanies();

  return (
    <main className="container mx-auto py-10 max-w-3xl">
      <Breadcrumbs items={[{ label: "Roles", href: "/roles" }, { label: "Add Role" }]} />
      <Card>
        <CardHeader>
          <CardTitle>Add New Role</CardTitle>
          <CardDescription>
            Save a job listing to track your application process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                You need to add a company before you can add a role.
              </p>
              <Link href="/companies/new" className={buttonVariants({ variant: "default" })}>
                Add a Company First
              </Link>
            </div>
          ) : (
            <RoleForm companies={companies} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}