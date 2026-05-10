import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, GraduationCap, Sparkles, BarChart3 } from "lucide-react";
import logo from "@/assets/timebridge-logo.png";
import uniLogo from "@/assets/poznan-university.png";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/seniors", label: "User Management", icon: Users, exact: false },
  { to: "/students", label: "Mentors", icon: GraduationCap, exact: false },
  { to: "/matching", label: "Smart Match", icon: Sparkles, exact: false },
  { to: "/reports", label: "Impact Reports", icon: BarChart3, exact: false },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-gradient-sidebar text-sidebar-foreground min-h-screen sticky top-0 relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-16 h-64 w-64 rounded-full bg-brand-glow/20 blur-3xl" />

      <div className="relative px-5 py-6 border-b border-sidebar-border/60">
        <Link to="/" className="block rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-white/40 hover:scale-[1.02] transition-transform">
          <img src={logo} alt="TimeBridge" className="h-12 w-auto" />
        </Link>
        <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-sidebar-foreground/60">
          Intergenerational · Digital · Inclusion
        </p>
      </div>

      <nav className="relative flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-[#ffd03a] text-[#014bad] shadow-yellow"
                  : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform ${active ? "" : "group-hover:scale-110"}`} />
              {it.label}
              {active && <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#014bad] animate-pulse-glow" />}
            </Link>
          );
        })}
      </nav>

      <div className="relative p-4 border-t border-sidebar-border/60 space-y-3">
        <div className="rounded-lg bg-white/95 px-3 py-2 flex items-center gap-2 shadow-soft">
          <img src={uniLogo} alt="Poznań University of Economics and Business" className="h-9 w-auto" />
        </div>
        <p className="text-[10px] text-sidebar-foreground/50 leading-relaxed">
          A research initiative in partnership with Poznań University of Economics and Business.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="md:hidden bg-gradient-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border/60">
        <div className="rounded-lg bg-white px-2 py-1">
          <img src={logo} alt="TimeBridge" className="h-5 w-auto" />
        </div>
        <div className="rounded-md bg-white px-2 py-1">
          <img src={uniLogo} alt="Poznań University" className="h-6 w-auto" />
        </div>
      </div>
      <nav className="flex overflow-x-auto px-2 py-2 gap-1">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                active ? "bg-gradient-brand text-sidebar-primary-foreground shadow-glow" : "text-sidebar-foreground/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
