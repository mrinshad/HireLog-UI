"use client";

import { Communication, Application, Role, Company } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { Eye } from "lucide-react";

interface CommunicationTableProps {
  communications: Communication[];
  applications: Application[];
  roles: Role[];
  companies: Company[];
  total: number;
  page: number;
  perPage: number;
}

export function CommunicationTable({
  communications, applications, roles, companies, total, page, perPage,
}: CommunicationTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`/communications?${params.toString()}`);
    },
    [router, searchParams]
  );

  const getAppDetails = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { roleTitle: "Unknown", companyName: "Unknown" };
    const role = roles.find((r) => r.id === app.role_id);
    const company = role ? companies.find((c) => c.id === role.company_id) : null;
    return { roleTitle: role?.title || "Unknown", companyName: company?.name || "Unknown" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Communications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                const { roleTitle, companyName } = getAppDetails(comm.application_id);
                return (
                  <TableRow key={comm.id}>
                    <TableCell className="text-sm">
                      {new Date(comm.communication_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{comm.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={comm.direction === "Sent" ? "default" : "secondary"}>
                        {comm.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {comm.subject || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{companyName}</TableCell>
                    <TableCell className="text-sm">{roleTitle}</TableCell>
                    <TableCell>
                      <Link
                        href={`/communications/${comm.id}`}
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

        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={(p) => updateParams({ page: String(p) })}
        />
      </CardContent>
    </Card>
  );
}
