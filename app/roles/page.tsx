import { getRolesPaginated, getCompanies } from "@/lib/api";
import { RoleTable } from "@/components/roles/role-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function RolesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const offset = Number(params.offset) || 0;
  const pageSize = Number(params.pageSize) || 20;

  const [result, companies] = await Promise.all([
    getRolesPaginated({
      offset,
      pageSize,
      search: params.search,
      companyId: params.company_id,
      source: params.source,
      createdFrom: params.created_from,
      createdTo: params.created_to,
    }),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <Link href="/roles/new" className={buttonVariants({ variant: "default" })}>
          Add Role
        </Link>
      </div>

      <RoleTable
        roles={result.data}
        companies={companies}
        total={result.total}
        offset={offset}
        pageSize={pageSize}
      />
    </main>
  );
}