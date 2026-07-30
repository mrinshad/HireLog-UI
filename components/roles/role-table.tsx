"use client";

import { Role, Company } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterCombobox } from "@/components/ui/filter-combobox";
import { Pagination } from "@/components/ui/pagination";
import { Search, X } from "lucide-react";

interface RoleTableProps {
  roles: Role[];
  companies: Company[];
  total: number;
  page: number;
  perPage: number;
}

export function RoleTable({ roles, companies, total, page, perPage }: RoleTableProps) {
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
      router.push(`/roles?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/roles");

  const getCompanyName = (companyId: string) =>
    companies.find((c) => c.id === companyId)?.name || "Unknown Company";

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));

  // Extract unique sources from currently loaded roles + all visible roles
  const sourceOptions = useMemo(() => {
    const sources = new Set<string>();
    roles.forEach((r) => { if (r.source) sources.add(r.source); });
    return Array.from(sources).sort().map((s) => ({ value: s, label: s }));
  }, [roles]);

  const currentSearch = searchParams.get("search") || "";
  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("company_id") ||
    searchParams.get("source") ||
    searchParams.get("created_from") ||
    searchParams.get("created_to");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Roles Directory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search + Filters */}
        <div className="space-y-3">
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
                placeholder="Search company, title, notes…"
                defaultValue={currentSearch}
                className="pl-9 h-9"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">Search</Button>
          </form>

          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1 min-w-[180px]">
              <Label className="text-xs">Company</Label>
              <FilterCombobox
                options={companyOptions}
                value={searchParams.get("company_id") || ""}
                onValueChange={(v) => updateParams({ company_id: v })}
                placeholder="All companies"
                searchPlaceholder="Search companies…"
              />
            </div>

            <div className="space-y-1 min-w-[140px]">
              <Label className="text-xs">Source</Label>
              <FilterCombobox
                options={sourceOptions}
                value={searchParams.get("source") || ""}
                onValueChange={(v) => updateParams({ source: v })}
                placeholder="All sources"
                searchPlaceholder="Search sources…"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Added from</Label>
              <Input
                type="date"
                className="h-9 text-sm w-[140px]"
                value={searchParams.get("created_from") || ""}
                onChange={(e) => updateParams({ created_from: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Added to</Label>
              <Input
                type="date"
                className="h-9 text-sm w-[140px]"
                value={searchParams.get("created_to") || ""}
                onChange={(e) => updateParams({ created_to: e.target.value })}
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
                  {hasFilters ? "No roles match your filters." : "No roles tracked yet."}
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.job_url ? (
                      <a href={role.job_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {role.title}
                      </a>
                    ) : (
                      role.title
                    )}
                  </TableCell>
                  <TableCell>{getCompanyName(role.company_id)}</TableCell>
                  <TableCell>{role.location || "-"}</TableCell>
                  <TableCell>{role.source || "-"}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(role.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={(p) => updateParams({ page: String(p) }, false)}
        />
      </CardContent>
    </Card>
  );
}