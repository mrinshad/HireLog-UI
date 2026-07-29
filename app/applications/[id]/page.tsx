import { notFound } from "next/navigation";
import { getApplications, getRoles, getCompanies, getStatusHistory, getCommunications } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { UpdateStatusForm } from "@/components/applications/update-status-form";
import { CommunicationSection } from "@/components/applications/communication-section";
// Define the expected params for Next.js 15+
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ApplicationDetailsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const appId = resolvedParams.id;

    // Fetch all necessary data concurrently
    const [applications, roles, companies, history, communications] = await Promise.all([
        getApplications(),
        getRoles(),
        getCompanies(),
        getStatusHistory(appId),
        getCommunications(appId),
    ]);

    // Resolve the specific application and its relations
    const application = applications.find((a) => a.id === appId);
    if (!application) return notFound();

    const role = roles.find((r) => r.id === application.role_id);
    const company = role ? companies.find((c) => c.id === role.company_id) : null;

    return (
        <main className="container mx-auto py-10 max-w-6xl">
            <div className="mb-6">
                <Link
                    href="/applications"
                    className={buttonVariants({ variant: "link", className: "p-0 h-auto mb-4 justify-start" })}
                >
                    ← Back to Applications
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {role?.title || "Unknown Role"}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {company?.name || "Unknown Company"} • {role?.location || "No location specified"}
                        </p>
                    </div>
                    <Badge className="text-base px-4 py-1" variant="secondary">
                        {application.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Details & Update Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-muted-foreground block">Applied On</span>
                                    {application.applied_date ? new Date(application.applied_date).toLocaleDateString() : "Not specified"}
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block">Source</span>
                                    {role?.source || "Not specified"}
                                </div>
                                {role?.job_url && (
                                    <div className="col-span-2">
                                        <span className="font-semibold text-muted-foreground block">Job Link</span>
                                        <a href={role.job_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                            {role.job_url}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {application.notes && (
                                <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
                                    <span className="font-semibold block mb-1">Initial Notes:</span>
                                    {application.notes}
                                </div>
                            )}

                            {/* The Update Form Component */}
                            <UpdateStatusForm applicationId={application.id} currentStatus={application.status} />
                        </CardContent>
                    </Card>
                    <CommunicationSection applicationId={application.id} communications={communications} />
                </div>

                {/* Right Column: Status History Timeline */}
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                            <CardDescription>History of status changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No history recorded yet.</p>
                            ) : (
                                <div className="relative border-l border-muted-foreground/20 ml-3 space-y-6">
                                    {history.map((record) => (
                                        <div key={record.id} className="relative pl-6">
                                            {/* Timeline dot */}
                                            <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{record.status}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(record.changed_at).toLocaleString()}
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