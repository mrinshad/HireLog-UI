import { getApplications, getRoles, getCompanies } from "@/lib/api";
import { ApplicationTable } from "@/components/applications/application-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function ApplicationsPage() {
  const [applications, roles, companies] = await Promise.all([
    getApplications(),
    getRoles(),
    getCompanies(),
  ]);

  return (
    <main className="container mx-auto py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <Link href="/applications/new" className={buttonVariants({ variant: "default" })}>
          Track Application
        </Link>
      </div>

      <ApplicationTable 
        applications={applications} 
        roles={roles} 
        companies={companies} 
      />
    </main>
  );
}