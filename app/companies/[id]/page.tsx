import { notFound } from "next/navigation";
import {
  getCompany,
  getRoles,
  getApplications,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  User,
  Eye,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "interested": return "bg-slate-500 hover:bg-slate-600";
    case "planned": return "bg-indigo-500 hover:bg-indigo-600";
    case "applied": return "bg-blue-500 hover:bg-blue-600";
    case "screening": return "bg-purple-500 hover:bg-purple-600";
    case "interview": return "bg-amber-500 hover:bg-amber-600";
    case "offer": return "bg-green-500 hover:bg-green-600";
    case "rejected": return "bg-red-500 hover:bg-red-600";
    case "ghosted": return "bg-gray-400 hover:bg-gray-500";
    case "withdrawn": return "bg-gray-500 hover:bg-gray-600";
    default: return "bg-slate-500 hover:bg-slate-600";
  }
};

export default async function CompanyDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const company = await getCompany(resolvedParams.id);

  if (!company) return notFound();

  const [allRoles, allApplications] = await Promise.all([
    getRoles(company.id),
    getApplications(),
  ]);

  // Roles for this company
  const companyRoles = allRoles.filter((r) => r.company_id === company.id);
  const companyRoleIds = new Set(companyRoles.map((r) => r.id));

  // Applications for this company's roles
  const companyApplications = allApplications.filter((a) =>
    companyRoleIds.has(a.role_id)
  );

  // Helper to get role title by ID
  const getRoleTitle = (roleId: string) =>
    companyRoles.find((r) => r.id === roleId)?.title || "Unknown Role";

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/companies"
          className={buttonVariants({
            variant: "link",
            className: "p-0 h-auto mb-4 justify-start",
          })}
        >
          ← Back to Companies
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
              <Building2 className="h-7 w-7 text-primary" />
              {company.name}
            </h1>
            {company.location && (
              <p className="text-lg text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {company.location}
              </p>
            )}
          </div>
          <Link
            href={`/companies/${company.id}/edit`}
            className={buttonVariants({ variant: "outline" })}
          >
            Edit Company
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Details ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {company.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium text-muted-foreground block">Website</span>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {company.career_page_url && (
                  <div className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium text-muted-foreground block">Career Page</span>
                      <a
                        href={company.career_page_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Careers
                      </a>
                    </div>
                  </div>
                )}

                {company.recruiter_name && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium text-muted-foreground block">Recruiter</span>
                      {company.recruiter_name}
                    </div>
                  </div>
                )}

                {company.hr_email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium text-muted-foreground block">HR Email</span>
                      <a
                        href={`mailto:${company.hr_email}`}
                        className="text-primary hover:underline"
                      >
                        {company.hr_email}
                      </a>
                    </div>
                  </div>
                )}

                {company.other_emails && (
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground block">Other Emails</span>
                    {company.other_emails}
                  </div>
                )}

                {company.contact_page_url && (
                  <div>
                    <span className="font-medium text-muted-foreground block">Contact Page</span>
                    <a
                      href={company.contact_page_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Contact Page
                    </a>
                  </div>
                )}
              </div>

              {company.notes && (
                <>
                  <Separator className="my-4" />
                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground block mb-1">Notes</span>
                    <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                      {company.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Applications for this company */}
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                {companyApplications.length} application{companyApplications.length !== 1 ? "s" : ""} tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companyApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No applications for this company yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Updated</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {getRoleTitle(app.role_id)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {app.applied_date
                            ? new Date(app.applied_date).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {new Date(app.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/applications/${app.id}`}
                            className={buttonVariants({ variant: "ghost", size: "icon" })}
                            title="View application"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Roles ── */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>
                {companyRoles.length} role{companyRoles.length !== 1 ? "s" : ""} tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companyRoles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No roles added yet.</p>
              ) : (
                <div className="space-y-3">
                  {companyRoles.map((role) => (
                    <div
                      key={role.id}
                      className="p-3 rounded-md border bg-muted/30 text-sm space-y-1"
                    >
                      <div className="font-medium">{role.title}</div>
                      {role.location && (
                        <div className="text-muted-foreground text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {role.location}
                        </div>
                      )}
                      {role.job_url && (
                        <a
                          href={role.job_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline text-xs inline-flex items-center gap-1"
                        >
                          Job Listing <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {role.source && (
                        <div className="text-muted-foreground text-xs">
                          Source: {role.source}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
