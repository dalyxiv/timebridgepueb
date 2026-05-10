import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const COLORS = ["#014bad", "#ffd03a", "#0b66d8", "#ffb800", "#6b91d4"];

function ReportsPage() {
  const { matches, seniors } = useApp();

  // Hours over time — group by week (mocked across last 8 weeks distributed)
  const totalHours = matches.reduce((s, m) => s + m.hoursLogged, 0);
  const weeks = Array.from({ length: 8 }, (_, i) => `W${i + 1}`);
  const distributed = weeks.map((w, i) => ({
    week: w,
    hours: Math.max(0, Math.round((totalHours / 8) * (0.6 + (i / 8) * 0.9) + (i === 7 ? totalHours - Math.round(totalHours * 0.95) : 0))),
  }));

  // Demographics by age bucket
  const buckets = { "60-69": 0, "70-79": 0, "80+": 0 };
  seniors.forEach((s) => {
    if (s.age < 70) buckets["60-69"]++;
    else if (s.age < 80) buckets["70-79"]++;
    else buckets["80+"]++;
  });
  const demoData = Object.entries(buckets).map(([name, value]) => ({ name, value }));

  // Skills distribution
  const skillCounts: Record<string, number> = {};
  seniors.forEach((s) => s.needs.forEach((n) => { skillCounts[n] = (skillCounts[n] || 0) + 1; }));
  const skillData = Object.entries(skillCounts).map(([name, value]) => ({ name, value }));

  return (
    <>
      <PageHeader title="Impact Reporting" description="Visualize program reach and outcomes." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatTile label="Total Hours" value={totalHours.toString()} suffix="logged" />
        <StatTile label="Active Pairs" value={matches.length.toString()} suffix="ongoing" />
        <StatTile label="Seniors Served" value={seniors.length.toString()} suffix="enrolled" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Mentorship Hours Over Time</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  <Bar dataKey="hours" fill="#014bad" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Demographics Served</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demoData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={3} label>
                    {demoData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Top Skill Needs</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={120} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  <Bar dataKey="value" fill="#ffd03a" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatTile({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold mt-1">{value} <span className="text-sm text-muted-foreground font-normal">{suffix}</span></p>
      </CardContent>
    </Card>
  );
}
