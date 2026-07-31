"use client";

import { Application, Role, Company } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FilterCombobox } from "@/components/ui/filter-combobox";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { Eye, Search, X } from "lucide-react";

interface ApplicationTableProps {
  applications: Application[];
  roles: Role[];
  companies: Company[];
  total: number;
  page: number;
  perPage: number;
}

const STATUSES = [
  "Interested", "Planned", "Applied", "Screening",
  "Interview", "Offer", "Rejected", "Ghosted", "Withdrawn",
];

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

export function ApplicationTable({
  applications, roles, companies, total, page, perPage,
}: ApplicationTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      if (resetPage) params.set("page", "1");
      router.push(`/applications?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/applications");

  const getJobDetails = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    const company = role ? companies.find((c) => c.id === role.company_id) : null;
    return { roleTitle: role?.title || "Unknown", companyName: company?.name || "Unknown" };
  };

  const roleOptions = roles.map((r) => {
    const c = companies.find((c) => c.id === r.company_id);
    return { value: r.id, label: `${c?.name || "?"} — ${r.title}` };
  });

  const currentSearch = searchParams.get("search") || "";
  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("role_id") ||
    searchParams.get("status") ||
    searchParams.get("reply_received") ||
    searchParams.get("updated_from") ||
    searchParams.get("updated_to");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Applications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search + Filters */}
        <div className="space-y-3">
          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              updateParams({ search: fd.get("search") as string });
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search company, role, notes…"
                defaultValue={currentSearch}
                className="pl-9 h-9"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>
          </form>

          {/* Filters row */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1 min-w-[180px]">
              <Label className="text-xs">Role</Label>
              <FilterCombobox
                options={roleOptions}
                value={searchParams.get("role_id") || ""}
                onValueChange={(v) => updateParams({ role_id: v })}
                placeholder="All roles"
                searchPlaceholder="Search roles…"
              />
            </div>

            <div className="space-y-1 min-w-[140px]">
              <Label className="text-xs">Status</Label>
              <Select
                value={searchParams.get("status") || "all"}
                onValueChange={(v) => updateParams({ status: v === "all" || !v ? "" : v })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-xs">Reply</Label>
              <Select
                value={searchParams.get("reply_received") || "all"}
                onValueChange={(v) => updateParams({ reply_received: v === "all" || !v ? "" : v })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Updated from</Label>
              <Input
                type="date"
                className="h-9 text-sm w-[140px]"
                value={searchParams.get("updated_from") || ""}
                onChange={(e) => updateParams({ updated_from: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Updated to</Label>
              <Input
                type="date"
                className="h-9 text-sm w-[140px]"
                value={searchParams.get("updated_to") || ""}
                onChange={(e) => updateParams({ updated_to: e.target.value })}
              />
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-9">
                <X className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
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
                  {hasFilters ? "No applications match your filters." : "No applications tracked yet. Time to apply!"}
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
                      <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm">{app.contact_person || "-"}</TableCell>
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

        {/* Pagination */}
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={(p) => updateParams({ page: String(p) }, false)}
          onPerPageChange={(pp) => updateParams({ perPage: String(pp) }, true)}
        />
      </CardContent>
    </Card>
  );
}