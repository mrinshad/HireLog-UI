import { getCompaniesPaginated } from "@/lib/api";
import { CompanyTable } from "@/components/companies/company-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface CompaniesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 20;

  const result = await getCompaniesPaginated({
    page,
    perPage,
    search: params.search,
  });

  // Backend only returns offset/page_size, so derive the current page from that
  const currentPage = Math.floor(result.offset / result.page_size) + 1;

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
        page={currentPage}
        perPage={result.page_size}
      />
    </main>
  );
}