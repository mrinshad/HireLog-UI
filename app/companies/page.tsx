import { getCompanies } from "@/lib/api";
import { CompanyTable } from "@/components/companies/company-table";
import { buttonVariants } from "@/components/ui/button"; // <-- Import this
import Link from "next/link";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <main className="container mx-auto py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        {/* Replace <Button asChild> with this: */}
        <Link href="/companies/new" className={buttonVariants({ variant: "default" })}>
          Add Company
        </Link>
      </div>

      <CompanyTable companies={companies} />
    </main>
  );
}