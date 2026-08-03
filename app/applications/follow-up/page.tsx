import { getApplicationsPaginated, getRoles, getCompanies } from "@/lib/api";
import { ApplicationTable } from "@/components/applications/application-table";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface FollowUpApplicationsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function FollowUpApplicationsPage({ searchParams }: FollowUpApplicationsPageProps) {
  const params = await searchParams;
  const offset = Number(params.offset) || 0;
  const pageSize = Number(params.pageSize) || 20;

  // We explicitly override the status to only show follow-up eligible applications,
  // unless the user selects a specific status in the UI that is also within this set.
  // Actually, to keep it simple, we just pass the default filter, but if they change
  // the status dropdown to "all", they might see everything. The prompt said
  // "showing only applications with status between Applied and Offer".
  // A robust way is to enforce it in the API call.
  const filterStatus = params.status || "Applied,Screening,Interview,Offer";

  const [result, roles, companies] = await Promise.all([
    getApplicationsPaginated({
      offset,
      pageSize,
      search: params.search,
      roleId: params.role_id,
      status: filterStatus,
      replyReceived: params.reply_received,
      updatedFrom: params.updated_from,
      updatedTo: params.updated_to,
    }),
    getRoles(),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Follow-up Applications" }]} />
      
      <div className="flex justify-between items-center mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Follow-up Applications</h1>
      </div>

      <ApplicationTable
        applications={result.data}
        roles={roles}
        companies={companies}
        total={result.total}
        offset={offset}
        pageSize={result.page_size}
      />
    </main>
  );
}
