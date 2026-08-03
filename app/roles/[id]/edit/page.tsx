import { getCompanies, getRole } from "@/lib/api";
import { RoleForm } from "@/components/roles/role-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { notFound } from "next/navigation";

interface EditRolePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { id } = await params;
  const [role, companies] = await Promise.all([
    getRole(id),
    getCompanies(),
  ]);

  if (!role) {
    notFound();
  }

  return (
    <main className="container mx-auto py-10 max-w-3xl">
      <Breadcrumbs items={[{ label: "Roles", href: "/roles" }, { label: "Edit Role" }]} />
      <Card>
        <CardHeader>
          <CardTitle>Edit Role</CardTitle>
          <CardDescription>
            Update details for {role.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleForm companies={companies} initialData={role} />
        </CardContent>
      </Card>
    </main>
  );
}