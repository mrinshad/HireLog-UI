import { getCompaniesPaginated } from "@/lib/api";
import { CompanyTable } from "@/components/companies/company-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getCompaniesPaginated({
    page,
    perPage: 20,
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
        page={result.page}
        perPage={result.per_page}
      />
    </main>
  );
}