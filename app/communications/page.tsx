import { getAllCommunications, getApplications, getRoles, getCompanies } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function CommunicationsPage() {
  const [communications, applications, roles, companies] = await Promise.all([
    getAllCommunications(),
    getApplications(),
    getRoles(),
    getCompanies(),
  ]);

  // Helper to resolve application details
  const getAppDetails = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { roleTitle: "Unknown", companyName: "Unknown", status: "Unknown" };
    const role = roles.find((r) => r.id === app.role_id);
    const company = role ? companies.find((c) => c.id === role.company_id) : null;
    return {
      roleTitle: role?.title || "Unknown Role",
      companyName: company?.name || "Unknown Company",
      status: app.status,
    };
  };

  return (
    <main className="container mx-auto py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No communications logged yet.
                  </TableCell>
                </TableRow>
              ) : (
                communications.map((comm) => {
                  const { roleTitle, companyName } = getAppDetails(
                    comm.application_id
                  );
                  return (
                    <TableRow key={comm.id}>
                      <TableCell className="text-sm">
                        {new Date(comm.communication_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{comm.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            comm.direction === "Sent" ? "default" : "secondary"
                          }
                        >
                          {comm.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {comm.subject || "-"}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {companyName}
                      </TableCell>
                      <TableCell className="text-sm">{roleTitle}</TableCell>
                      <TableCell>
                        <Link
                          href={`/communications/${comm.id}`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                          })}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
