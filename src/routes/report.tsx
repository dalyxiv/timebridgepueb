import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ShieldAlert, ShieldCheck, Clock, Flag } from "lucide-react";

export const Route = createFileRoute("/report")({ component: ReportPage });

type Severity = "low" | "medium" | "high";
type Status = "open" | "reviewing" | "resolved";
type Category = "Harassment" | "No-show" | "Inappropriate behavior" | "Safety concern" | "Other";

interface Report {
  id: string;
  reporter: string;
  subject: string;
  category: Category;
  severity: Severity;
  description: string;
  status: Status;
  at: string;
}

const seed: Report[] = [
  { id: "r1", reporter: "Eleanor Whitfield", subject: "Anonymous mentor", category: "No-show", severity: "low", description: "Mentor missed our scheduled Wednesday session without notice.", status: "reviewing", at: new Date().toISOString() },
  { id: "r2", reporter: "Henryk Kowalski", subject: "Anonymous mentor", category: "Inappropriate behavior", severity: "high", description: "Mentor asked personal financial questions during the session.", status: "open", at: new Date().toISOString() },
];

const sevColor: Record<Severity, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};
const statusColor: Record<Status, string> = {
  open: "bg-red-100 text-red-800",
  reviewing: "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800",
};

function ReportPage() {
  const [reports, setReports] = useState<Report[]>(seed);
  const [reporter, setReporter] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category>("Inappropriate behavior");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!reporter.trim()) return toast.error("Please enter your name");
    if (!subject.trim()) return toast.error("Who is this report about?");
    if (description.trim().length < 10) return toast.error("Please describe what happened (10+ characters)");
    const r: Report = {
      id: Math.random().toString(36).slice(2, 10),
      reporter, subject, category, severity, description,
      status: "open",
      at: new Date().toISOString(),
    };
    setReports((arr) => [r, ...arr]);
    setReporter(""); setSubject(""); setDescription("");
    toast.success("Report submitted — our team will review within 24h");
  };

  const advance = (id: string) => {
    setReports((arr) => arr.map((r) => {
      if (r.id !== id) return r;
      const next: Status = r.status === "open" ? "reviewing" : r.status === "reviewing" ? "resolved" : "resolved";
      return { ...r, status: next };
    }));
    toast.success("Report status updated");
  };

  const open = reports.filter((r) => r.status === "open").length;
  const reviewing = reports.filter((r) => r.status === "reviewing").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;

  return (
    <>
      <PageHeader
        eyebrow="Trust & Safety"
        title="User Reports"
        description="Report misbehavior, safety concerns, or policy violations. Our team reviews every submission confidentially within 24 hours."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatTile icon={ShieldAlert} label="Open" value={open} tone="red" />
        <StatTile icon={Clock} label="Under review" value={reviewing} tone="amber" />
        <StatTile icon={ShieldCheck} label="Resolved" value={resolved} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 border-border/70 shadow-soft animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-highlight text-[#014bad]">
                <Flag className="h-4 w-4" />
              </span>
              Submit a report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Your name</Label>
              <Input value={reporter} onChange={(e) => setReporter(e.target.value)} placeholder="e.g. Eleanor Whitfield" />
            </div>
            <div className="space-y-1.5">
              <Label>Person or session involved</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Name or session ID" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Harassment">Harassment</SelectItem>
                    <SelectItem value="No-show">No-show</SelectItem>
                    <SelectItem value="Inappropriate behavior">Inappropriate behavior</SelectItem>
                    <SelectItem value="Safety concern">Safety concern</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Severity</Label>
                <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>What happened?</Label>
              <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the incident with as much detail as possible…" />
            </div>
            <Button onClick={submit} className="w-full bg-[#014bad] hover:bg-[#013a8a] text-white font-semibold">
              <AlertTriangle className="h-4 w-4 mr-2" /> Submit confidential report
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/70 shadow-soft animate-fade-in-up delay-200">
          <CardHeader>
            <CardTitle className="text-base">Recent reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {reports.map((r) => (
                <li key={r.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{r.subject}</span>
                      <Badge variant="outline" className="text-xs">{r.category}</Badge>
                      <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md ${sevColor[r.severity]}`}>{r.severity}</span>
                      <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md ${statusColor[r.status]}`}>{r.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Reported by {r.reporter}</p>
                  </div>
                  {r.status !== "resolved" && (
                    <Button size="sm" variant="outline" onClick={() => advance(r.id)}>
                      {r.status === "open" ? "Start review" : "Mark resolved"}
                    </Button>
                  )}
                </li>
              ))}
              {reports.length === 0 && <li className="py-6 text-sm text-muted-foreground text-center">No reports yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatTile({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "red" | "amber" | "emerald" }) {
  const tones = {
    red: "bg-red-50 text-red-700 ring-red-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  } as const;
  return (
    <Card className="border-border/70 shadow-soft hover-lift">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold mt-0.5 tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
