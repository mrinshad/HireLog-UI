import { Company } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Eye, ExternalLink } from "lucide-react";

interface CompanyTableProps {
  companies: Company[];
}

export function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No companies tracked yet.
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.location || "-"}</TableCell>
                  <TableCell className="text-sm">{company.recruiter_name || "-"}</TableCell>
                  <TableCell className="text-sm">{company.hr_email || "-"}</TableCell>
                  <TableCell>
                    {company.website ? (
                      <a
                        href={company.website}
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
      </CardContent>
    </Card>
  );
}