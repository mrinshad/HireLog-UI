import { getRoles, getCompanies } from "@/lib/api";
import { RoleTable } from "@/components/roles/role-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function RolesPage() {
  const [roles, companies] = await Promise.all([
    getRoles(),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <Link href="/roles/new" className={buttonVariants({ variant: "default" })}>
          Add Role
        </Link>
      </div>

      <RoleTable roles={roles} companies={companies} />
    </main>
  );
}