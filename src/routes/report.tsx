import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Flag,
  Search,
  Sparkles,
  Lock,
} from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/report")({ component: ReportPage });

type Severity = "low" | "medium" | "high";
type Status = "open" | "reviewing" | "resolved";
const CATEGORIES = [
  "Harassment",
  "No-show",
  "Inappropriate behavior",
  "Safety concern",
  "Privacy / data",
  "Other",
] as const;
type Category = (typeof CATEGORIES)[number];

interface Report {
  id: string;
  reporter: string;
  subjectLabel: string;
  category: Category;
  severity: Severity;
  description: string;
  status: Status;
  at: string;
}

const sevColor: Record<Severity, string> = {
  low: "bg-blue-100 text-blue-800 ring-blue-200",
  medium: "bg-amber-100 text-amber-800 ring-amber-200",
  high: "bg-red-100 text-red-800 ring-red-200",
};
const statusColor: Record<Status, string> = {
  open: "bg-red-100 text-red-800 ring-red-200",
  reviewing: "bg-amber-100 text-amber-800 ring-amber-200",
  resolved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

function suggestSeverity(text: string): Severity {
  const t = text.toLowerCase();
  if (/(unsafe|threat|assault|harass|abuse|scam|fraud|stolen|theft|weapon|emergency|danger)/.test(t)) return "high";
  if (/(rude|uncomfortable|inappropriate|late|no.?show|missed|cancel|ignore)/.test(t)) return "medium";
  return "low";
}
function suggestCategory(text: string): Category {
  const t = text.toLowerCase();
  if (/(harass|abuse|insult|slur)/.test(t)) return "Harassment";
  if (/(no.?show|missed|didn'?t show|absent|skipped)/.test(t)) return "No-show";
  if (/(unsafe|danger|threat|emergency|injur)/.test(t)) return "Safety concern";
  if (/(data|password|privacy|personal info|bank|account)/.test(t)) return "Privacy / data";
  if (/(rude|inappropriate|uncomfortable|crude)/.test(t)) return "Inappropriate behavior";
  return "Other";
}

const SEED: Report[] = [
  {
    id: "r1",
    reporter: "Eleanor Whitfield",
    subjectLabel: "Anonymous mentor",
    category: "No-show",
    severity: "low",
    description: "Mentor missed our scheduled Wednesday session without notice.",
    status: "reviewing",
    at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "r2",
    reporter: "Henryk Kowalski",
    subjectLabel: "Anonymous mentor",
    category: "Privacy / data",
    severity: "high",
    description: "Mentor asked detailed personal financial questions during the session.",
    status: "open",
    at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

function ReportPage() {
  const app = useApp();
  const seniors = app?.seniors ?? [];
  const students = app?.students ?? [];

  const [reports, setReports] = useState<Report[]>(SEED);
  const [reporter, setReporter] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category>("Inappropriate behavior");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const peopleOptions = useMemo(
    () => [
      ...seniors.map((s) => `${s.name} (Senior)`),
      ...students.map((s) => `${s.name} (Mentor)`),
    ],
    [seniors, students],
  );

  const aiSeverity = suggestSeverity(description);
  const aiCategory = suggestCategory(description);

  const submit = () => {
    if (!reporter.trim()) { toast.error("Please enter your name"); return; }
    if (!subject.trim()) { toast.error("Who is this report about?"); return; }
    if (description.trim().length < 10) { toast.error("Please describe what happened (10+ characters)"); return; }

    const r: Report = {
      id: Math.random().toString(36).slice(2, 10),
      reporter: reporter.trim(),
      subjectLabel: subject.trim(),
      category,
      severity,
      description: description.trim(),
      status: "open",
      at: new Date().toISOString(),
    };
    setReports((arr) => [r, ...arr]);
    setReporter(""); setSubject(""); setDescription("");
    toast.success("Report submitted — Trust & Safety will review within 24h");
  };

  const advance = (id: string) => {
    setReports((arr) =>
      arr.map((r) => {
        if (r.id !== id) return r;
        const next: Status = r.status === "open" ? "reviewing" : "resolved";
        return { ...r, status: next };
      }),
    );
    toast.success("Report status updated");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.subjectLabel.toLowerCase().includes(q) ||
        r.reporter.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [reports, search, statusFilter]);

  const open = reports.filter((r) => r.status === "open").length;
  const reviewing = reports.filter((r) => r.status === "reviewing").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const highSeverity = reports.filter((r) => r.severity === "high" && r.status !== "resolved").length;

  const selectCls =
    "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#014bad]/30";

  return (
    <>
      <PageHeader
        eyebrow="Trust & Safety"
        title="User Reports"
        description="Report misbehavior, safety concerns, or policy violations. Every submission is confidential and reviewed within 24 hours."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile icon={ShieldAlert} label="Open" value={open} tone="red" />
        <StatTile icon={Clock} label="Under review" value={reviewing} tone="amber" />
        <StatTile icon={ShieldCheck} label="Resolved" value={resolved} tone="emerald" />
        <StatTile icon={AlertTriangle} label="High severity" value={highSeverity} tone="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 border-border/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-[#ffd03a]/30 text-[#014bad]">
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
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Name or session ID"
                list="tb-people"
              />
              <datalist id="tb-people">
                {peopleOptions.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select className={selectCls} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Severity</Label>
                <select className={selectCls} value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>What happened?</Label>
              <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the incident with as much detail as possible…" />
            </div>

            {description.trim().length >= 10 && (
              <div className="rounded-lg border border-[#014bad]/15 bg-[#014bad]/5 px-3 py-2.5 flex items-start gap-2.5 text-xs">
                <Sparkles className="h-4 w-4 text-[#014bad] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-700">
                    Smart suggestion: <span className="font-semibold text-[#014bad]">{aiCategory}</span> · <span className="font-semibold text-[#014bad]">{aiSeverity}</span> severity
                  </p>
                </div>
                {(aiCategory !== category || aiSeverity !== severity) && (
                  <button
                    type="button"
                    onClick={() => { setCategory(aiCategory); setSeverity(aiSeverity); toast.success("Applied smart suggestion"); }}
                    className="text-[#014bad] font-semibold hover:underline"
                  >
                    Apply
                  </button>
                )}
              </div>
            )}

            <Button onClick={submit} className="w-full bg-[#014bad] hover:bg-[#013a8a] text-white font-semibold">
              <AlertTriangle className="h-4 w-4 mr-2" /> Submit confidential report
            </Button>

            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Encrypted in transit · visible only to Trust &amp; Safety
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/70 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Recent reports</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="h-8 pl-8 w-44 text-xs" />
              </div>
              <select className="h-8 px-2 text-xs rounded-md border border-input bg-background" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="all">All status</option>
                <option value="open">Open</option>
                <option value="reviewing">Reviewing</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {filtered.map((r) => (
                <li key={r.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{r.subjectLabel}</span>
                      <Badge variant="outline" className="text-xs">{r.category}</Badge>
                      <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md ring-1 ${sevColor[r.severity]}`}>{r.severity}</span>
                      <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-md ring-1 ${statusColor[r.status]}`}>{r.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Reported by {r.reporter} · {new Date(r.at).toLocaleString()}
                    </p>
                  </div>
                  {r.status !== "resolved" && (
                    <Button size="sm" variant="outline" onClick={() => advance(r.id)}>
                      {r.status === "open" ? "Start review" : "Mark resolved"}
                    </Button>
                  )}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="py-10 text-sm text-muted-foreground text-center">No reports match your filters.</li>
              )}
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
