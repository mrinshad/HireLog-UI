import { notFound } from "next/navigation";
import {
  getApplication,
  getRoles,
  getCompanies,
  getStatusHistory,
  getCommunications,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  MapPin,
  MessageSquare,
  User,
  Mail,
} from "lucide-react";
import { UpdateStatusForm } from "@/components/applications/update-status-form";
import { CommunicationSection } from "@/components/applications/communication-section";

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

export default async function ApplicationDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const [application, roles, companies, history, communications] =
    await Promise.all([
      getApplication(appId),
      getRoles(),
      getCompanies(),
      getStatusHistory(appId),
      getCommunications(appId),
    ]);

  if (!application) return notFound();

  const role = roles.find((r) => r.id === application.role_id);
  const company = role
    ? companies.find((c) => c.id === role.company_id)
    : null;

  return (
    <main className="container mx-auto py-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/applications"
          className={buttonVariants({
            variant: "link",
            className: "p-0 h-auto mb-4 justify-start",
          })}
        >
          ← Back to Applications
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {role?.title || "Unknown Role"}
            </h1>
            <p className="text-lg text-muted-foreground flex items-center gap-2 flex-wrap">
              {company?.name || "Unknown Company"}
              {role?.location && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {role.location}
                  </span>
                </>
              )}
            </p>
          </div>
          <Badge className={`${getStatusColor(application.status)} text-base px-4 py-1 shrink-0`}>
            {application.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ──────── Left Column: Details + Status Update ──────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-medium text-muted-foreground block">Applied On</span>
                    {application.applied_date
                      ? new Date(application.applied_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not specified"}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-medium text-muted-foreground block">Reply Received</span>
                    {application.reply_received ? (
                      <span className="text-green-600 dark:text-green-400">
                        Yes
                        {application.last_reply_date &&
                          ` — ${new Date(application.last_reply_date).toLocaleDateString()}`}
                      </span>
                    ) : (
                      "No"
                    )}
                  </div>
                </div>

                {application.contact_person && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium text-muted-foreground block">Contact Person</span>
                      {application.contact_person}
                    </div>
                  </div>
                )}

                {application.contact_info && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <span className="font-medium text-muted-foreground block">Contact Info</span>
                      {application.contact_info}
                    </div>
                  </div>
                )}

                {role?.source && (
                  <div>
                    <span className="font-medium text-muted-foreground block">Source</span>
                    {role.source}
                  </div>
                )}

                {role?.job_url && (
                  <div>
                    <span className="font-medium text-muted-foreground block">Job Link</span>
                    <a
                      href={role.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Listing <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {application.notes && (
                <>
                  <Separator className="my-4" />
                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground block mb-1">Notes</span>
                    <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                      {application.notes}
                    </p>
                  </div>
                </>
              )}

              {/* Inline status update */}
              <UpdateStatusForm
                applicationId={application.id}
                currentStatus={application.status}
              />
            </CardContent>
          </Card>

          {/* Communications */}
          <CommunicationSection
            applicationId={application.id}
            communications={communications}
          />
        </div>

        {/* ──────── Right Column: Timeline ──────── */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Status change history</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No history recorded yet.
                </p>
              ) : (
                <div className="relative border-l-2 border-muted-foreground/20 ml-3 space-y-6">
                  {history.map((record, idx) => (
                    <div key={record.id} className="relative pl-6">
                      {/* Dot */}
                      <span
                        className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 border-background ${
                          idx === 0 ? "bg-primary" : "bg-muted-foreground/40"
                        }`}
                      />
                      <div className="flex flex-col gap-0.5">
                        <Badge
                          variant="outline"
                          className="w-fit text-xs font-semibold"
                        >
                          {record.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(record.changed_at).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        {record.notes && (
                          <p className="text-sm mt-1 text-muted-foreground bg-muted/30 p-2 rounded">
                            {record.notes}
                          </p>
                        )}
                      </div>
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