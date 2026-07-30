import { Application, Role, Company } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

interface ApplicationTableProps {
  applications: Application[];
  roles: Role[];
  companies: Company[];
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

export function ApplicationTable({ applications, roles, companies }: ApplicationTableProps) {
  const getJobDetails = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    const company = role ? companies.find((c) => c.id === role.company_id) : null;
    return {
      roleTitle: role?.title || "Unknown Role",
      companyName: company?.name || "Unknown Company",
      location: role?.location || "-",
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Reply</TableHead>
              <TableHead className="text-right">Last Updated</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No applications tracked yet. Time to apply!
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => {
                const { roleTitle, companyName } = getJobDetails(app.role_id);
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{companyName}</TableCell>
                    <TableCell>{roleTitle}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {app.contact_person || "-"}
                    </TableCell>
                    <TableCell>
                      {app.reply_received ? (
                        <Badge variant="outline" className="border-green-500 text-green-600">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(app.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/applications/${app.id}`}
                        className={buttonVariants({ variant: "ghost", size: "icon" })}
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
  );
}