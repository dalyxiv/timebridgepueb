import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type TechSkill =
  | "Smartphone"
  | "Email"
  | "Video Calling"
  | "Internet Browsing"
  | "Online Banking"
  | "Social Media"
  | "Word Processing"
  | "Online Shopping";

export const ALL_SKILLS: TechSkill[] = [
  "Smartphone",
  "Email",
  "Video Calling",
  "Internet Browsing",
  "Online Banking",
  "Social Media",
  "Word Processing",
  "Online Shopping",
];

export const AVAILABILITY = ["Mon AM", "Mon PM", "Tue AM", "Tue PM", "Wed AM", "Wed PM", "Thu AM", "Thu PM", "Fri AM", "Fri PM"] as const;
export type Slot = (typeof AVAILABILITY)[number];

export interface Senior {
  id: string;
  name: string;
  age: number;
  needs: TechSkill[];
  availability: Slot[];
  status: "pending" | "active";
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  skills: TechSkill[];
  availability: Slot[];
  status: "pending" | "active";
  createdAt: string;
}

export interface Match {
  id: string;
  seniorId: string;
  studentId: string;
  hoursLogged: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  text: string;
  at: string;
}

interface AppState {
  seniors: Senior[];
  students: Student[];
  matches: Match[];
  activity: Activity[];
  addSenior: (s: Omit<Senior, "id" | "createdAt" | "status">) => void;
  addStudent: (s: Omit<Student, "id" | "createdAt" | "status">) => void;
  approveStudent: (id: string) => void;
  approveSenior: (id: string) => void;
  createMatch: (seniorId: string, studentId: string) => void;
  removeMatch: (id: string) => void;
  logHours: (matchId: string, hours: number) => void;
  autoMatch: () => number;
}

const Ctx = createContext<AppState | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const seedSeniors: Senior[] = [
  { id: uid(), name: "Eleanor Whitfield", age: 72, needs: ["Smartphone", "Video Calling"], availability: ["Mon AM", "Wed AM"], status: "active", createdAt: now() },
  { id: uid(), name: "Henryk Kowalski", age: 78, needs: ["Email", "Online Banking"], availability: ["Tue PM", "Thu PM"], status: "active", createdAt: now() },
  { id: uid(), name: "Margaret Chen", age: 69, needs: ["Social Media", "Video Calling"], availability: ["Mon PM", "Fri AM"], status: "pending", createdAt: now() },
  { id: uid(), name: "Robert O'Brien", age: 81, needs: ["Online Shopping", "Internet Browsing"], availability: ["Wed PM"], status: "pending", createdAt: now() },
  { id: uid(), name: "Anna Nowak", age: 74, needs: ["Smartphone", "Email"], availability: ["Thu AM", "Fri PM"], status: "pending", createdAt: now() },
];

const seedStudents: Student[] = [
  { id: uid(), name: "Hasan Gelir", grade: "Senior", skills: ["Smartphone", "Video Calling", "Social Media"], availability: ["Mon AM", "Wed AM"], status: "active", createdAt: now() },
  { id: uid(), name: "Menghu Shu", grade: "Junior", skills: ["Email", "Online Banking", "Word Processing"], availability: ["Tue PM", "Thu PM"], status: "active", createdAt: now() },
  { id: uid(), name: "Michal", grade: "Sophomore", skills: ["Smartphone", "Email", "Internet Browsing"], availability: ["Thu AM", "Fri PM"], status: "pending", createdAt: now() },
  { id: uid(), name: "DalY", grade: "Senior", skills: ["Video Calling", "Social Media", "Online Shopping"], availability: ["Mon PM", "Fri AM"], status: "active", createdAt: now() },
];

const seedMatches: Match[] = [
  { id: uid(), seniorId: seedSeniors[0].id, studentId: seedStudents[0].id, hoursLogged: 12, createdAt: now() },
  { id: uid(), seniorId: seedSeniors[1].id, studentId: seedStudents[1].id, hoursLogged: 8, createdAt: now() },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [seniors, setSeniors] = useState<Senior[]>(seedSeniors);
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [matches, setMatches] = useState<Match[]>(seedMatches);
  const [activity, setActivity] = useState<Activity[]>([
    { id: uid(), text: "Match created: Eleanor Whitfield ↔ Hasan Gelir", at: now() },
    { id: uid(), text: "Henryk Kowalski logged 2 hours with Menghu Shu", at: now() },
  ]);

  const log = useCallback((text: string) => {
    setActivity((a) => [{ id: uid(), text, at: now() }, ...a].slice(0, 30));
  }, []);

  const addSenior: AppState["addSenior"] = (s) => {
    const item: Senior = { ...s, id: uid(), status: "pending", createdAt: now() };
    setSeniors((arr) => [item, ...arr]);
    log(`New senior onboarded: ${item.name}`);
  };
  const addStudent: AppState["addStudent"] = (s) => {
    const item: Student = { ...s, id: uid(), status: "pending", createdAt: now() };
    setStudents((arr) => [item, ...arr]);
    log(`New student applied: ${item.name}`);
  };
  const approveStudent = (id: string) => {
    setStudents((arr) => arr.map((s) => (s.id === id ? { ...s, status: "active" } : s)));
    const s = students.find((x) => x.id === id);
    if (s) log(`Student approved: ${s.name}`);
  };
  const approveSenior = (id: string) => {
    setSeniors((arr) => arr.map((s) => (s.id === id ? { ...s, status: "active" } : s)));
    const s = seniors.find((x) => x.id === id);
    if (s) log(`Senior approved: ${s.name}`);
  };
  const createMatch: AppState["createMatch"] = (seniorId, studentId) => {
    const m: Match = { id: uid(), seniorId, studentId, hoursLogged: 0, createdAt: now() };
    setMatches((arr) => [m, ...arr]);
    setSeniors((arr) => arr.map((s) => (s.id === seniorId ? { ...s, status: "active" } : s)));
    setStudents((arr) => arr.map((s) => (s.id === studentId ? { ...s, status: "active" } : s)));
    const sn = seniors.find((x) => x.id === seniorId);
    const st = students.find((x) => x.id === studentId);
    if (sn && st) log(`Match created: ${sn.name} ↔ ${st.name}`);
  };
  const removeMatch = (id: string) => {
    setMatches((arr) => arr.filter((m) => m.id !== id));
    log(`Match dissolved`);
  };
  const logHours = (matchId: string, hours: number) => {
    setMatches((arr) => arr.map((m) => (m.id === matchId ? { ...m, hoursLogged: m.hoursLogged + hours } : m)));
    log(`${hours}h mentorship logged`);
  };

  const autoMatch = () => {
    const matched = new Set<string>();
    matches.forEach((m) => {
      matched.add("snr:" + m.seniorId);
      matched.add("std:" + m.studentId);
    });
    const usn = seniors.filter((s) => !matched.has("snr:" + s.id));
    const ust = students.filter((s) => !matched.has("std:" + s.id) && s.status === "active");

    let count = 0;
    const newMatches: Match[] = [];
    const usedStu = new Set<string>();
    for (const sn of usn) {
      let best: { id: string; score: number } | null = null;
      for (const st of ust) {
        if (usedStu.has(st.id)) continue;
        const skillOverlap = sn.needs.filter((n) => st.skills.includes(n)).length;
        const availOverlap = sn.availability.filter((a) => st.availability.includes(a)).length;
        const score = skillOverlap * 2 + availOverlap;
        if (skillOverlap > 0 && availOverlap > 0 && (!best || score > best.score)) {
          best = { id: st.id, score };
        }
      }
      if (best) {
        usedStu.add(best.id);
        newMatches.push({ id: uid(), seniorId: sn.id, studentId: best.id, hoursLogged: 0, createdAt: now() });
        count++;
      }
    }
    if (count > 0) {
      setMatches((arr) => [...newMatches, ...arr]);
      setSeniors((arr) => arr.map((s) => (newMatches.some((m) => m.seniorId === s.id) ? { ...s, status: "active" } : s)));
      log(`Auto-matched ${count} new pair${count > 1 ? "s" : ""}`);
    }
    return count;
  };

  return (
    <Ctx.Provider value={{ seniors, students, matches, activity, addSenior, addStudent, approveSenior, approveStudent, createMatch, removeMatch, logHours, autoMatch }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
