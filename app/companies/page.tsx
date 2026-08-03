import { getCompaniesPaginated } from "@/lib/api";
import { CompanyTable } from "@/components/companies/company-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface CompaniesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const DEFAULT_PAGE_SIZE = 20;

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const offset = Number(params.offset) || 0;
  const pageSize = Number(params.pageSize) || DEFAULT_PAGE_SIZE;

  const result = await getCompaniesPaginated({
    offset,
    pageSize,
    search: params.search,
  });

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <Link href="/companies/new" className={buttonVariants({ variant: "default" })}>
          Add Company
        </Link>
      </div>

      <CompanyTable
        companies={result.data}
        total={result.total}
        offset={offset}
        pageSize={pageSize}
      />
    </main>
  );
}