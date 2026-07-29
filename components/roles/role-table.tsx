import { Role, Company } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleTableProps {
  roles: Role[];
  companies: Company[];
}

export function RoleTable({ roles, companies }: RoleTableProps) {
  // Helper function to find company name by ID
  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "Unknown Company";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Roles Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No roles tracked yet.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.job_url ? (
                      <a href={role.job_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        {role.title}
                      </a>
                    ) : (
                      role.title
                    )}
                  </TableCell>
                  <TableCell>{getCompanyName(role.company_id)}</TableCell>
                  <TableCell>{role.location || "-"}</TableCell>
                  <TableCell>{role.source || "-"}</TableCell>
                  <TableCell className="text-right">
                    {new Date(role.created_at).toLocaleDateString()}
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