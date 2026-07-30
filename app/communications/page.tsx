import { getCommunicationsPaginated, getApplications, getRoles, getCompanies } from "@/lib/api";
import { CommunicationTable } from "@/components/communications/communication-table";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CommunicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [result, applications, roles, companies] = await Promise.all([
    getCommunicationsPaginated({ page, perPage: 20 }),
    getApplications(),
    getRoles(),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
      </div>

      <CommunicationTable
        communications={result.data}
        applications={applications}
        roles={roles}
        companies={companies}
        total={result.total}
        page={result.page}
        perPage={result.per_page}
      />
    </main>
  );
}
