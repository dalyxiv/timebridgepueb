import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_SKILLS, AVAILABILITY, type TechSkill, type Slot } from "@/lib/store";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Props {
  trigger?: ReactNode;
  role: "senior" | "student";
  onSubmit: (data: {
    name: string;
    age?: number;
    grade?: string;
    skills: TechSkill[];
    availability: Slot[];
  }) => void;
}

export function PersonForm({ trigger, role, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("Sophomore");
  const [skills, setSkills] = useState<TechSkill[]>([]);
  const [availability, setAvailability] = useState<Slot[]>([]);

  const reset = () => { setName(""); setAge(""); setGrade("Sophomore"); setSkills([]); setAvailability([]); };

  const submit = () => {
    if (!name.trim()) { toast.error("Please enter a full name"); return; }
    // Lenient defaults: if availability/skills are empty, pick a sensible default
    // so the user can onboard quickly without filling every box.
    const finalSkills = skills.length ? skills : [ALL_SKILLS[0]];
    const finalAvailability = availability.length ? availability : [AVAILABILITY[0]];
    onSubmit({
      name: name.trim(),
      age: role === "senior" ? (Number(age) > 0 ? Number(age) : 65) : undefined,
      grade: role === "student" ? grade : undefined,
      skills: finalSkills,
      availability: finalAvailability,
    });
    reset();
    setOpen(false);
  };

  const toggle = <T,>(arr: T[], v: T, setter: (a: T[]) => void) => {
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="h-4 w-4 mr-1" /> Add {role === "senior" ? "Senior" : "Student"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Onboard a new {role === "senior" ? "senior" : "student mentor"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            {role === "senior" ? (
              <div>
                <Label className="text-xs">Age</Label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="70" />
              </div>
            ) : (
              <div>
                <Label className="text-xs">Grade</Label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            )}
          </div>
          <div>
            <Label className="text-xs">{role === "senior" ? "Tech needs" : "Tech skills"}</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {ALL_SKILLS.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={skills.includes(s)} onCheckedChange={() => toggle(skills, s, setSkills)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs">Availability</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {AVAILABILITY.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggle(availability, a, setAvailability)}
                  className={`text-xs rounded-md border px-2 py-1.5 transition-colors ${
                    availability.includes(a)
                      ? "bg-brand text-brand-foreground border-brand"
                      : "bg-background border-border hover:bg-accent"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
