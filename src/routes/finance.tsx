import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Banknote, TrendingUp, Wallet, PiggyBank, Handshake, Building2, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/finance")({ component: FinancePage });

const fmt = (n: number) => `€${n.toLocaleString()}`;

const revenue = [
  { month: "Jan", grants: 18000, partnerships: 12000, services: 4000 },
  { month: "Feb", grants: 22000, partnerships: 14000, services: 5200 },
  { month: "Mar", grants: 25000, partnerships: 18000, services: 6100 },
  { month: "Apr", grants: 21000, partnerships: 22000, services: 7400 },
  { month: "May", grants: 30000, partnerships: 26000, services: 8800 },
  { month: "Jun", grants: 28000, partnerships: 31000, services: 9600 },
];

const expenses = [
  { name: "Platform R&D", value: 42, color: "#014bad" },
  { name: "Mentor stipends", value: 28, color: "#ffd03a" },
  { name: "Operations", value: 16, color: "#3b82f6" },
  { name: "Outreach", value: 9, color: "#ffb800" },
  { name: "Admin", value: 5, color: "#94a3b8" },
];

const partners = [
  { name: "City of Poznań", type: "Municipality", tier: "Platinum", contribution: 120000, since: "2023", status: "Active" },
  { name: "Poznań Univ. of Economics & Business", type: "Academic", tier: "Strategic", contribution: 85000, since: "2023", status: "Active" },
  { name: "Allegro Foundation", type: "Corporate", tier: "Gold", contribution: 60000, since: "2024", status: "Active" },
  { name: "EU Digital Europe Programme", type: "Grant", tier: "Platinum", contribution: 240000, since: "2024", status: "Active" },
  { name: "Santander Universidades", type: "Corporate", tier: "Silver", contribution: 35000, since: "2024", status: "Pending renewal" },
  { name: "Volkswagen Poznań", type: "Corporate", tier: "Gold", contribution: 50000, since: "2025", status: "Active" },
];

const tiers = [
  { name: "Silver Partner", price: 15000, perks: ["Logo on platform", "Quarterly impact report", "1 institutional seat"] },
  { name: "Gold Partner", price: 40000, perks: ["All Silver benefits", "Co-branded cohort", "Annual board briefing", "5 institutional seats"] },
  { name: "Platinum Partner", price: 90000, perks: ["All Gold benefits", "Dedicated success manager", "Custom reporting API", "Unlimited seats"] },
];

function Stat({ icon: Icon, label, value, delta, accent }: any) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft hover-lift ${accent ? "ring-glow" : ""}`}>
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
          <p className="text-3xl font-semibold mt-2 text-foreground tabular-nums">{value}</p>
          {delta && <p className="mt-1 text-xs text-success inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />{delta}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${accent ? "bg-gradient-highlight text-[#014bad] shadow-yellow" : "bg-gradient-brand text-brand-foreground shadow-glow"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function BecomePartnerDialog() {
  const [open, setOpen] = useState(false);
  const [org, setOrg] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("Gold Partner");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!org.trim() || !email.trim() || !contact.trim()) {
      toast.error("Please fill in your name, organization and email");
      return;
    }
    const subject = encodeURIComponent(`TimeBridge Partnership Inquiry — ${org} (${tier})`);
    const body = encodeURIComponent(
      `Hello TimeBridge team,\n\nMy name is ${contact} from ${org}.\nWe are interested in the ${tier} partnership.\n\n${message || "Please send us more information."}\n\nReply-to: ${email}\n\nBest regards,\n${contact}`
    );
    // Open the user's email client with a pre-filled message to our partnerships inbox
    window.location.href = `mailto:partners@timebridge.eu?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…", { description: `${org} · ${tier}` });
    setOrg(""); setContact(""); setEmail(""); setMessage(""); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#ffd03a] text-[#014bad] hover:bg-[#ffc21a] font-bold shadow-yellow">
          <Handshake className="h-4 w-4" /> Become a Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Partner with TimeBridge</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Send our partnerships team a message — we'll reply within 2 working days.
          </p>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div><Label className="text-xs">Your name</Label><Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Jane Doe" /></div>
          <div><Label className="text-xs">Organization</Label><Input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Your institution" /></div>
          <div><Label className="text-xs">Contact email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@org.eu" /></div>
          <div>
            <Label className="text-xs">Partnership tier</Label>
            <select value={tier} onChange={(e) => setTier(e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
              {tiers.map((t) => <option key={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Message (optional)</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Tell us a bit about your goals…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={submit}>
            <Mail className="h-4 w-4" /> Send inquiry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FinancePage() {
  const totalRevenue = revenue.reduce((s, r) => s + r.grants + r.partnerships + r.services, 0);
  const totalPartners = partners.length;
  const committed = partners.reduce((s, p) => s + p.contribution, 0);
  const runway = 18;

  return (
    <>
      <PageHeader
        eyebrow="Finance · Partnerships"
        title="Become a Partner"
        description="Full transparency on TimeBridge's funding, expenses, and partnership ecosystem."
        actions={<BecomePartnerDialog />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Banknote} label="YTD Revenue" value={fmt(totalRevenue)} delta="+24% YoY" />
        <Stat icon={Handshake} label="Active Partners" value={totalPartners} accent />
        <Stat icon={Wallet} label="Committed Funding" value={fmt(committed)} delta="6 contracts" />
        <Stat icon={PiggyBank} label="Operational Runway" value={`${runway} mo`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground"><TrendingUp className="h-4 w-4" /></span>
              Revenue by Source (2025)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
                <Bar dataKey="grants" stackId="a" fill="#014bad" name="Grants" radius={[0, 0, 0, 0]} />
                <Bar dataKey="partnerships" stackId="a" fill="#ffd03a" name="Partnerships" />
                <Bar dataKey="services" stackId="a" fill="#3b82f6" name="Services" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-highlight text-[#014bad]"><Wallet className="h-4 w-4" /></span>
              Expense Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenses} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {expenses.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-soft">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground"><Building2 className="h-4 w-4" /></span>
            Active Partners &amp; Funders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Since</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.type}</TableCell>
                  <TableCell>
                    <Badge className={p.tier === "Platinum" || p.tier === "Strategic" ? "bg-[#014bad] text-white" : p.tier === "Gold" ? "bg-[#ffd03a] text-[#014bad]" : "bg-slate-200 text-slate-700"}>
                      {p.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums font-medium">{fmt(p.contribution)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.since}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "Active" ? "default" : "outline"} className={p.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t, i) => (
          <Card key={t.name} className={`relative overflow-hidden shadow-soft hover-lift ${i === 1 ? "ring-2 ring-[#ffd03a]" : ""}`}>
            {i === 1 && <div className="absolute top-3 right-3"><Badge className="bg-[#ffd03a] text-[#014bad]">Most popular</Badge></div>}
            <CardHeader>
              <CardTitle className="text-lg text-[#014bad]">{t.name}</CardTitle>
              <p className="text-3xl font-bold mt-1 text-foreground">{fmt(t.price)}<span className="text-sm font-normal text-muted-foreground"> / year</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-[#014bad] shrink-0 mt-0.5" />{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-brand p-6 sm:p-8 shadow-elevated">
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-[#ffd03a]/30 blur-3xl" />
        <div className="relative grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#ffd03a]">Get in touch</p>
            <h3 className="text-xl font-semibold mt-2 text-white">Join 6+ institutions scaling digital inclusion across Europe.</h3>
            <p className="text-sm text-white/80 mt-2">Reach our partnerships team to discuss custom tiers, co-funded research, and EU grant consortia.</p>
          </div>
          <a href="mailto:partners@timebridge.eu" className="inline-flex items-center justify-center rounded-xl bg-[#ffd03a] px-5 py-3 text-sm font-bold text-[#014bad] shadow-yellow hover:scale-105 transition-transform">
            <Mail className="h-4 w-4" /> partners@timebridge.eu
          </a>
        </div>
      </div>
    </>
  );
}
