import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, type Senior, type Student } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Link2, X, Plus, Clock } from "lucide-react";

export const Route = createFileRoute("/matching")({ component: MatchingPage });

function MatchingPage() {
  const { seniors, students, matches, createMatch, removeMatch, autoMatch, logHours } = useApp();

  const matchedSnr = new Set(matches.map((m) => m.seniorId));
  const matchedStu = new Set(matches.map((m) => m.studentId));
  const unmatchedSeniors = seniors.filter((s) => !matchedSnr.has(s.id) && s.status === "active");
  const unmatchedStudents = students.filter((s) => !matchedStu.has(s.id) && s.status === "active");

  const [selSenior, setSelSenior] = useState<string | null>(null);
  const [selStudent, setSelStudent] = useState<string | null>(null);

  const compat = (sn: Senior, st: Student) => {
    const skill = sn.needs.filter((n) => st.skills.includes(n)).length;
    const avail = sn.availability.filter((a) => st.availability.includes(a)).length;
    return { skill, avail, total: skill * 2 + avail };
  };

  const confirmMatch = () => {
    if (!selSenior || !selStudent) return;
    createMatch(selSenior, selStudent);
    toast.success("Match successfully created!");
    setSelSenior(null);
    setSelStudent(null);
  };

  const handleAutoMatch = () => {
    const n = autoMatch();
    if (n > 0) toast.success(`Auto-matched ${n} pair${n > 1 ? "s" : ""}`);
    else toast.info("No compatible auto-matches found");
  };

  return (
    <>
      <PageHeader
        title="Smart Matching"
        description="Pair seniors with student mentors using shared skills and availability."
        actions={
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={handleAutoMatch}>
            <Sparkles className="h-4 w-4 mr-1.5" /> Run Auto-Match
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        {/* Seniors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Unmatched Seniors ({unmatchedSeniors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unmatchedSeniors.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelSenior(s.id === selSenior ? null : s.id)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  selSenior === s.id ? "border-brand bg-accent" : "border-border hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{s.name}</p>
                  <span className="text-xs text-muted-foreground">{s.age}y</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.needs.map((n) => <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{s.availability.join(" · ")}</p>
              </button>
            ))}
            {unmatchedSeniors.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">All seniors matched.</p>}
          </CardContent>
        </Card>

        {/* Match button */}
        <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-2 sticky top-8">
          <Button
            disabled={!selSenior || !selStudent}
            onClick={confirmMatch}
            className="bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-40"
            size="lg"
          >
            <Link2 className="h-4 w-4 mr-1.5" /> Pair
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center max-w-[140px]">
            Select one from each side to manually pair.
          </p>
        </div>

        {/* Students */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Available Students ({unmatchedStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unmatchedStudents.map((s) => {
              const sn = unmatchedSeniors.find((x) => x.id === selSenior);
              const c = sn ? compat(sn, s) : null;
              const fit = c && c.skill > 0 && c.avail > 0;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelStudent(s.id === selStudent ? null : s.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    selStudent === s.id ? "border-brand bg-accent" : fit ? "border-brand/40 hover:bg-accent/50" : "border-border hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{s.name}</p>
                    <span className="text-xs text-muted-foreground">{s.grade}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.skills.map((n) => <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground">{s.availability.join(" · ")}</p>
                    {c && fit && <Badge className="bg-brand/15 text-brand border-0 text-xs">★ Good fit</Badge>}
                  </div>
                </button>
              );
            })}
            {unmatchedStudents.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No available students.</p>}
          </CardContent>
        </Card>

        {/* Mobile pair button */}
        <div className="lg:hidden col-span-full">
          <Button
            disabled={!selSenior || !selStudent}
            onClick={confirmMatch}
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Link2 className="h-4 w-4 mr-1.5" /> Pair Selected
          </Button>
        </div>
      </div>

      {/* Active matches */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Active Matches ({matches.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {matches.map((m) => {
            const sn = seniors.find((x) => x.id === m.seniorId);
            const st = students.find((x) => x.id === m.studentId);
            if (!sn || !st) return null;
            return (
              <Card key={m.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{sn.name}</p>
                      <p className="text-xs text-muted-foreground">↔ {st.name}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { removeMatch(m.id); toast("Match dissolved"); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {m.hoursLogged}h logged
                    </span>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { logHours(m.id, 1); toast.success("1h logged"); }}>
                      <Plus className="h-3 w-3 mr-1" /> Log hour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {matches.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No matches yet.</p>}
        </div>
      </div>
    </>
  );
}
