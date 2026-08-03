import Link from "next/link";
import { Suspense } from "react";
import {
  Briefcase,
  Building2,
  TrendingUp,
  Mail,
  Clock,
  CheckCircle2,
  ArrowRight,
  Target,
  Inbox,
  BarChart3,
  Calendar,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getDashboardStats,
  getPipelineCounts,
  getApplications,
  getApplicationsPaginated,
  getRoles,
  getCompanies,
  getCommunicationsPaginated,
} from "@/lib/api";

const statusStyles: Record<string, string> = {
  Interested: "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200",
  Planned: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200",
  Applied: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200",
  Screening: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
  Interview: "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200",
  Offer: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200",
  Ghosted: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200",
  Withdrawn: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200",
};

const pipelineColors: Record<string, string> = {
  Interview: "bg-orange-500",
  Screening: "bg-yellow-500",
  Applied: "bg-purple-500",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
  Interested: "bg-slate-500",
  Planned: "bg-blue-500",
  Ghosted: "bg-gray-500",
  Withdrawn: "bg-zinc-500",
};

// Shared entrance animation — respects prefers-reduced-motion via motion-safe:
const enter = "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-backwards";

export default function DashboardPage() {
  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Track your job search progress and manage applications in real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/companies/new" className={buttonVariants({ variant: "outline" })}>
            Add Company
          </Link>
          <Link href="/applications/new" className={buttonVariants({ variant: "default" })}>
            New Application
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className={cn(enter, "flex flex-wrap items-center gap-2")}>
        <Link
          href="/companies"
          className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 transition-colors" })}
        >
          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
          Company Directory
        </Link>

        <Link
          href="/roles"
          className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 transition-colors" })}
        >
          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
          Saved Roles
        </Link>

        <Link
          href="/applications"
          className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 transition-colors" })}
        >
          <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
          Master Tracker
        </Link>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Follow-up Applications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Follow-up Applications</h2>
              <Link
                href="/applications/follow-up"
                className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1" })}
              >
                More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<RecentApplicationsSkeleton />}>
              <FollowUpApplicationsSection />
            </Suspense>
          </div>

          {/* Recent Applications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
              <Link
                href="/applications"
                className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1" })}
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<RecentApplicationsSkeleton />}>
              <RecentApplicationsSection />
            </Suspense>
          </div>
        </div>

        {/* Right Column: Sidebar Actions & Pipeline */}
        <div className="space-y-8">
          {/* Pipeline Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Pipeline Status</h2>
            <Suspense fallback={<PipelineSkeleton />}>
              <PipelineSection />
            </Suspense>
          </div>

          {/* Recent Communications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Recent Communications</h2>
              <Link
                href="/communications"
                className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1" })}
              >
                More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<RecentCommunicationsSkeleton />}>
              <RecentCommunicationsSection />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                       */
/* -------------------------------------------------------------------------- */

async function StatsSection() {
  const statsData = await getDashboardStats();

  // Guard against missing/NaN values from the API instead of rendering "undefined" or "NaN%"
  const safeNumber = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? n : 0);
  const safeRate = (n: unknown) =>
    typeof n === "number" && Number.isFinite(n) ? `${n}%` : "—";

  const stats = [
    {
      title: "Total Applications",
      value: safeNumber(statsData?.total_applications).toLocaleString(),
      icon: Briefcase,
      trend: "Tracked in system",
    },
    {
      title: "In Interview",
      value: safeNumber(statsData?.in_interview).toLocaleString(),
      icon: Target,
      trend: "Active rounds",
    },
    {
      title: "Offers",
      value: safeNumber(statsData?.offers).toLocaleString(),
      icon: CheckCircle2,
      trend: "Successful outcomes",
    },
    {
      title: "Response Rate",
      value: safeRate(statsData?.response_rate),
      icon: Mail,
      trend: "Beyond applied stage",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={cn(
              enter,
              "hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tabular-nums">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent Applications                                                        */
/* -------------------------------------------------------------------------- */

async function RecentApplicationsSection() {
  const [applications, roles, companies] = await Promise.all([
    getApplications(),
    getRoles(),
    getCompanies(),
  ]);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <Card className={cn(enter, "delay-100")}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Applied</TableHead>
              <TableHead className="hidden md:table-cell text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-14">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium">No applications yet</p>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      Track your first application to see it show up here.
                    </p>
                    <Link
                      href="/applications/new"
                      className={buttonVariants({ variant: "outline", size: "sm", className: "mt-2" })}
                    >
                      New Application
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              recentApplications.map((app, i) => {
                const role = roles.find((r) => r.id === app.role_id);
                const company = role ? companies.find((c) => c.id === role.company_id) : null;

                return (
                  <TableRow
                    key={app.id}
                    className={cn(enter, "hover:bg-muted/40 transition-colors")}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <TableCell className="font-medium whitespace-nowrap">
                      {company?.name || "Unknown company"}
                    </TableCell>
                    <TableCell className="text-muted-foreground min-w-[150px]">
                      {role?.title || "Unknown role"}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", statusStyles[app.status] || statusStyles.Interested)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-right whitespace-nowrap">
                      <span className="flex items-center justify-end gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(app.updated_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function RecentApplicationsSkeleton() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Applied</TableHead>
              <TableHead className="hidden md:table-cell text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  <Skeleton className="h-4 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Pipeline                                                                    */
/* -------------------------------------------------------------------------- */

async function PipelineSection() {
  const [pipelineData, statsData] = await Promise.all([
    getPipelineCounts(),
    getDashboardStats(),
  ]);

  const totalAppsCount = statsData?.total_applications || 1; // guard divide-by-zero

  return (
    <Card className={cn(enter, "delay-150")}>
      <CardContent className="p-6 space-y-5">
        {pipelineData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <BarChart3 className="h-7 w-7 text-muted-foreground/50" />
            <p className="text-sm font-medium">No pipeline data yet</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Status breakdown appears once you have tracked applications.
            </p>
          </div>
        ) : (
          pipelineData.map((item, i) => {
            const percentage = Math.min(100, Math.round((item.count / totalAppsCount) * 100));
            return (
              <div
                key={item.status}
                className={cn(enter, "space-y-2")}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {item.count} <span className="text-xs ml-1">({percentage}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      pipelineColors[item.status] || "bg-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function PipelineSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Follow Up Applications                                                     */
/* -------------------------------------------------------------------------- */

async function FollowUpApplicationsSection() {
  const [result, roles, companies] = await Promise.all([
    getApplicationsPaginated({
      offset: 0,
      pageSize: 5,
      status: "Applied,Screening,Interview,Offer",
    }),
    getRoles(),
    getCompanies(),
  ]);

  const followUpApplications = result.data;

  return (
    <Card className={cn(enter, "delay-100")}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {followUpApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <p className="text-sm font-medium">No follow-up applications</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              followUpApplications.map((app, i) => {
                const role = roles.find((r) => r.id === app.role_id);
                const company = role ? companies.find((c) => c.id === role.company_id) : null;

                return (
                  <TableRow
                    key={app.id}
                    className={cn(enter, "hover:bg-muted/40 transition-colors")}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <TableCell className="font-medium whitespace-nowrap">
                      {company?.name || "Unknown company"}
                    </TableCell>
                    <TableCell className="text-muted-foreground min-w-[150px]">
                      {role?.title || "Unknown role"}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", statusStyles[app.status] || statusStyles.Interested)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell text-right whitespace-nowrap">
                      <span className="flex items-center justify-end gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(app.updated_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent Communications                                                      */
/* -------------------------------------------------------------------------- */

async function RecentCommunicationsSection() {
  const result = await getCommunicationsPaginated({ offset: 0, pageSize: 5 });
  const communications = result.data;

  return (
    <Card className={cn(enter, "delay-200")}>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {communications.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-muted-foreground">
                  No communications logged.
                </TableCell>
              </TableRow>
            ) : (
              communications.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate max-w-[180px]">
                        {comm.subject || comm.type}
                      </span>
                      <Badge variant={comm.direction === "Sent" ? "default" : "secondary"} className="text-xs">
                        {comm.direction}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(comm.communication_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentCommunicationsSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}