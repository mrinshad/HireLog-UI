"use client";

import { Company } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { Eye, ExternalLink, Search, X } from "lucide-react";

interface CompanyTableProps {
  companies: Company[];
  total: number;
  offset: number;
  pageSize: number;
}

export function CompanyTable({ companies, total, offset, pageSize }: CompanyTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const updateParams = useCallback(
    (updates: Record<string, string>, resetOffset = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      if (resetOffset) params.set("offset", "0");
      router.push(`/companies?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/companies");
  const currentSearch = searchParams.get("search") || "";
  const hasSearch = !!currentSearch;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies Directory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
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
              placeholder="Search name, recruiter, notes…"
              defaultValue={currentSearch}
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" size="sm" variant="secondary">Search</Button>
          {hasSearch && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-9">
              <X className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
          )}
        </form>

        {/* Table */}
        {selectedRowIds.size > 0 && (
          <div className="text-sm text-muted-foreground mb-2">
            {selectedRowIds.size} row(s) selected.
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={companies.length > 0 && selectedRowIds.size === companies.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRowIds(new Set(companies.map(c => c.id)));
                    } else {
                      setSelectedRowIds(new Set());
                    }
                  }}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Recruiter</TableHead>
              <TableHead>HR Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Added</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  {hasSearch ? "No companies match your search." : "No companies tracked yet."}
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRowIds.has(company.id)}
                      onCheckedChange={(checked) => {
                        const newSet = new Set(selectedRowIds);
                        if (checked) newSet.add(company.id);
                        else newSet.delete(company.id);
                        setSelectedRowIds(newSet);
                      }}
                      aria-label={`Select ${company.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.location || "-"}</TableCell>
                  <TableCell className="text-sm">{company.recruiter_name || "-"}</TableCell>
                  <TableCell className="text-sm">{company.hr_email || "-"}</TableCell>
                  <TableCell>
                    {company.website ? (
                      <a href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(company.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/companies/${company.id}`}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          offset={offset}
          pageSize={pageSize}
          total={total}
          onPaginationChange={(newOffset, newPageSize) => updateParams({ offset: String(newOffset), pageSize: String(newPageSize) }, false)}
        />
      </CardContent>
    </Card>
  );
}