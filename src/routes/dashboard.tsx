import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Heart, Clock, ArrowRight, AlertCircle, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Overview,
});

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function StatCard({ icon: Icon, label, value, delta, accent }: { icon: any; label: string; value: string | number; delta?: string; accent?: boolean }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover-lift animate-fade-in-up ${accent ? "ring-glow" : "shadow-soft"}`}>
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-2xl group-hover:bg-highlight/30 transition-colors" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
          <p className="text-3xl font-semibold mt-2 text-foreground tabular-nums">{value}</p>
          {delta && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" /> {delta}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-2.5 transition-transform group-hover:scale-110 ${accent ? "bg-gradient-highlight text-[#014bad] shadow-yellow" : "bg-gradient-brand text-brand-foreground shadow-glow"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const { seniors, students, matches, activity } = useApp();
  const activeMatches = matches.length;
  const totalHours = matches.reduce((sum, m) => sum + m.hoursLogged, 0);
  const matchedSeniorIds = new Set(matches.map((m) => m.seniorId));
  const seniorsAwaiting = seniors.filter((s) => !matchedSeniorIds.has(s.id) && s.status === "active").length;
  const studentsPending = students.filter((s) => s.status === "pending").length;
  const seniorsPending = seniors.filter((s) => s.status === "pending").length;

  return (
    <>
      <PageHeader
        eyebrow="Operations Console"
        title="Welcome back, DalY"
        description="Real-time view of onboarding, matching, and mentorship impact across your TimeBridge cohort."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Seniors" value={seniors.length} delta="+2 this week" />
        <StatCard icon={GraduationCap} label="Total Mentors" value={students.length} delta="+1 this week" />
        <StatCard icon={Heart} label="Active Matches" value={activeMatches} accent />
        <StatCard icon={Clock} label="Hours Logged" value={totalHours} delta="+5h this week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-1 border-border/70 shadow-soft hover-lift overflow-hidden relative animate-fade-in-up delay-200">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-highlight text-[#014bad]">
                <AlertCircle className="h-4 w-4" />
              </span>
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PendingRow count={seniorsAwaiting} label="seniors await matching" to="/matching" />
            <PendingRow count={studentsPending} label="students pending approval" to="/students" />
            <PendingRow count={seniorsPending} label="seniors pending approval" to="/seniors" />
            {seniorsAwaiting + studentsPending + seniorsPending === 0 && (
              <p className="text-sm text-muted-foreground">All caught up — nothing pending.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/70 shadow-soft overflow-hidden relative animate-fade-in-up delay-400">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-highlight to-transparent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-brand text-brand-foreground">
                <Activity className="h-4 w-4" />
              </span>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-highlight shrink-0" />
                    <span className="text-foreground truncate">{a.text}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">{fmtDate(a.at)}</Badge>
                </li>
              ))}
              {activity.length === 0 && <li className="py-4 text-sm text-muted-foreground">No activity yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 relative overflow-hidden rounded-2xl border border-border bg-gradient-brand p-6 sm:p-8 shadow-elevated animate-fade-in-up delay-600">
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-[#ffd03a]/30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#ffd03a]">Mission</p>
            <h3 className="text-xl font-semibold mt-2 text-white">Bridging generations through digital fluency.</h3>
            <p className="text-sm text-white/80 mt-2 max-w-2xl">
              TimeBridge replaces manual spreadsheets with automated onboarding, smart matching, and live impact reporting — built for institutions that scale digital inclusion.
            </p>
          </div>
          <Link
            to="/matching"
            className="inline-flex items-center justify-center rounded-xl bg-[#ffd03a] px-5 py-3 text-sm font-bold text-[#014bad] shadow-yellow hover:scale-105 transition-transform"
          >
            Open matching engine <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function PendingRow({ count, label, to }: { count: number; label: string; to: string }) {
  if (count === 0) return null;
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-border bg-accent/30 px-3 py-2.5 hover:bg-accent hover:border-brand/40 transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-highlight text-[#014bad] text-xs font-bold shadow-yellow">{count}</span>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
