import { getApplicationsPaginated, getRoles, getCompanies } from "@/lib/api";
import { ApplicationTable } from "@/components/applications/application-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface ApplicationsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const ALLOWED_PER_PAGE = [10, 20, 50, 100];
const DEFAULT_PER_PAGE = 20;

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const requestedPerPage = Number(params.perPage) || DEFAULT_PER_PAGE;
  const perPage = ALLOWED_PER_PAGE.includes(requestedPerPage)
    ? requestedPerPage
    : DEFAULT_PER_PAGE;

  const [result, roles, companies] = await Promise.all([
    getApplicationsPaginated({
      page,
      perPage,
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

  const currentPage = Math.floor(result.offset / result.page_size) + 1;

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
        page={currentPage}
        perPage={result.page_size}
      />
    </main>
  );
}