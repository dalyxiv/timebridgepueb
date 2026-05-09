import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Heart, Clock, ArrowRight, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Overview,
});

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-semibold mt-2 text-foreground">{value}</p>
          </div>
          <div className={`rounded-lg p-2.5 ${accent ? "bg-brand text-brand-foreground" : "bg-accent text-accent-foreground"}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Overview() {
  const { seniors, students, matches, activity } = useApp();
  const activeMatches = matches.length;
  const totalHours = matches.reduce((sum, m) => sum + m.hoursLogged, 0);
  const matchedSeniorIds = new Set(matches.map((m) => m.seniorId));
  const matchedStudentIds = new Set(matches.map((m) => m.studentId));
  const seniorsAwaiting = seniors.filter((s) => !matchedSeniorIds.has(s.id)).length;
  const studentsPending = students.filter((s) => s.status === "pending").length;
  const seniorsPending = seniors.filter((s) => s.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Overview"
        description="Program health at a glance — onboarding, matching, and impact."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Seniors" value={seniors.filter(s => s.status === "active").length} />
        <StatCard icon={GraduationCap} label="Student Mentors" value={students.filter(s => s.status === "active").length} />
        <StatCard icon={Heart} label="Active Matches" value={activeMatches} accent />
        <StatCard icon={Clock} label="Mentorship Hours" value={totalHours} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-brand" />
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground">{a.text}</span>
                  <Badge variant="secondary" className="text-xs">{new Date(a.at).toLocaleDateString()}</Badge>
                </li>
              ))}
              {activity.length === 0 && <li className="py-4 text-sm text-muted-foreground">No activity yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function PendingRow({ count, label, to }: { count: number; label: string; to: string }) {
  if (count === 0) return null;
  return (
    <Link to={to} className="flex items-center justify-between rounded-md border border-border bg-accent/40 px-3 py-2.5 hover:bg-accent transition-colors">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-semibold">{count}</span>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
