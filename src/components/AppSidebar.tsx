import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, GraduationCap, Sparkles, BarChart3 } from "lucide-react";
import logo from "@/assets/timebridge-logo.png";

const items = [
  { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/seniors", label: "Seniors", icon: Users, exact: false },
  { to: "/students", label: "Students", icon: GraduationCap, exact: false },
  { to: "/matching", label: "Matching", icon: Sparkles, exact: false },
  { to: "/reports", label: "Impact", icon: BarChart3, exact: false },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-sidebar text-sidebar-foreground min-h-screen">
      <div className="px-5 py-5 border-b border-sidebar-border flex items-center gap-3">
        <div className="rounded-md bg-white px-2 py-1.5">
          <img src={logo} alt="TimeBridge" className="h-6 w-auto" />
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-sidebar-foreground/60 border-t border-sidebar-border">
        Powered by <span className="text-sidebar-foreground">TimeBridge</span>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="md:hidden flex overflow-x-auto bg-sidebar text-sidebar-foreground px-2 py-2 gap-1">
      {items.map((it) => {
        const active = it.exact ? path === it.to : path.startsWith(it.to);
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
              active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
