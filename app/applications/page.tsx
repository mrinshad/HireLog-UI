import { getApplicationsPaginated, getRoles, getCompanies } from "@/lib/api";
import { ApplicationTable } from "@/components/applications/application-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [result, roles, companies] = await Promise.all([
    getApplicationsPaginated({
      page,
      perPage: 20,
      search: params.search,
      roleId: params.role_id,
      status: params.status,
      replyReceived: params.reply_received,
      updatedFrom: params.updated_from,
      updatedTo: params.updated_to,
    }),
    getRoles(),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <Link href="/applications/new" className={buttonVariants({ variant: "default" })}>
          Track Application
        </Link>
      </div>

      <ApplicationTable
        applications={result.data}
        roles={roles}
        companies={companies}
        total={result.total}
        page={result.page}
        perPage={result.per_page}
      />
    </main>
  );
}