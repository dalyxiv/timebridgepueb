import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { PersonForm } from "@/components/PersonForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/seniors")({ component: SeniorsPage });

function SeniorsPage() {
  const { seniors, matches, addSenior, approveSenior } = useApp();
  const matchedIds = new Set(matches.map((m) => m.seniorId));

  return (
    <>
      <PageHeader
        title="Seniors"
        description="Onboard, review, and track senior participants."
        actions={
          <PersonForm
            role="senior"
            onSubmit={(d) => {
              addSenior({ name: d.name, age: d.age!, needs: d.skills, availability: d.availability });
              toast.success("New senior onboarded", { description: d.name });
            }}
          />
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Tech Needs</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Match Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seniors.map((s) => {
                const matched = matchedIds.has(s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.age}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {s.needs.map((n) => <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.availability.join(", ")}</TableCell>
                    <TableCell>
                      {matched ? (
                        <Badge className="bg-brand text-brand-foreground hover:bg-brand">Matched</Badge>
                      ) : s.status === "pending" ? (
                        <Badge variant="outline">Pending Approval</Badge>
                      ) : (
                        <Badge variant="outline">Unmatched</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {s.status === "pending" && (
                        <Button size="sm" variant="ghost" onClick={() => { approveSenior(s.id); toast.success(`${s.name} approved`); }}>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
