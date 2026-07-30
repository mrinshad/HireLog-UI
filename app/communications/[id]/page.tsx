import { notFound } from "next/navigation";
import { getAllCommunications, getApplications, getRoles, getCompanies } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Calendar, Eye, MessageSquare } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunicationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const commId = resolvedParams.id;

  const [allComms, applications, roles, companies] = await Promise.all([
    getAllCommunications(),
    getApplications(),
    getRoles(),
    getCompanies(),
  ]);

  const comm = allComms.find((c) => c.id === commId);
  if (!comm) return notFound();

  const app = applications.find((a) => a.id === comm.application_id);
  const role = app ? roles.find((r) => r.id === app.role_id) : null;
  const company = role ? companies.find((c) => c.id === role.company_id) : null;

  return (
    <main className="container mx-auto py-10 max-w-3xl">
      <div className="mb-8">
        <Breadcrumbs items={[{ label: "Communications", href: "/communications" }, { label: "Communication Details" }]} />
        <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-primary" />
          Communication Details
        </h1>
      </div>

      <div className="space-y-6">
        {/* Meta info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <Badge variant={comm.direction === "Sent" ? "default" : "secondary"}>
                {comm.direction}
              </Badge>
              <Badge variant="outline">{comm.type}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(comm.communication_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Application context */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <span>
                <span className="font-medium text-foreground">{company?.name || "Unknown"}</span>
                {" — "}
                {role?.title || "Unknown Role"}
              </span>
              {app && (
                <Link
                  href={`/applications/${app.id}`}
                  className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7 ml-auto" })}
                  title="View application"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {comm.subject || "No Subject"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {comm.content ? (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {comm.content}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No content recorded.</p>
            )}

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground">
              Created {new Date(comm.created_at).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
