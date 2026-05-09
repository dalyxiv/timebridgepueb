import type { ReactNode } from "react";

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="relative mb-8 animate-fade-in-up">
      {/* hero glow */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-[60%] rounded-full bg-brand/10 blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand mb-2">{eyebrow}</p>
          )}
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
