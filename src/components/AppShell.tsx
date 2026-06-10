import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Target, Wand2, BookOpen, CreditCard, LayoutTemplate,
  Image as ImageIcon, PenLine, Megaphone, Users, Library, ShieldCheck,
  Sparkles, Zap, Menu, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { section: "Fluxo da Oferta" },
  { to: "/app/validation", label: "1. Validação", icon: Target },
  { to: "/app/offer", label: "2. Construtor", icon: Wand2 },
  { to: "/app/ebook", label: "3. Ebook", icon: BookOpen },
  { to: "/app/checkout", label: "4. Checkout", icon: CreditCard },
  { to: "/app/landing", label: "5. Landing Page", icon: LayoutTemplate },
  { to: "/app/creatives", label: "6. Criativos", icon: ImageIcon },
  { to: "/app/copy", label: "7. Copywriter", icon: PenLine },
  { to: "/app/traffic", label: "8. Tráfego", icon: Megaphone },
  { section: "Operação" },
  { to: "/app/optimize", label: "Otimizador IA", icon: Sparkles },
  { to: "/app/crm", label: "Mini CRM", icon: Users },
  { to: "/app/library", label: "Biblioteca", icon: Library },
  { to: "/app/admin", label: "Admin", icon: ShieldCheck },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-border h-14 flex items-center justify-between px-4">
        <Link to="/app" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold tracking-tight">OfferAI Pro</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="size-9 rounded-lg glass grid place-items-center">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-30 h-screen w-72 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0 overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="hidden lg:flex items-center gap-2.5 px-6 h-16 border-b border-sidebar-border">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Zap className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold tracking-tight leading-none">OfferAI Pro</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">v1 · powered by IA</div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {nav.map((item, i) => {
            if ("section" in item) {
              return (
                <div key={i} className="px-3 pt-5 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
                  {item.section}
                </div>
              );
            }
            const Icon = item.icon;
            const isExact = "exact" in item && item.exact;
            const active = isExact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active ? "" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-4 mb-6">
          <div className="glass rounded-xl p-4 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-32 bg-primary/30 blur-3xl rounded-full" />
            <div className="relative">
              <div className="text-xs text-muted-foreground">Plano</div>
              <div className="font-display font-bold text-lg mt-0.5">Pro</div>
              <div className="text-xs text-muted-foreground mt-1">8.200 créditos IA restantes</div>
              <button className="mt-3 w-full text-xs font-semibold py-2 rounded-lg bg-gradient-vibrant text-primary-foreground">
                Comprar créditos
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 z-20 bg-background/60 backdrop-blur-sm" />
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div className="min-w-0">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            <span className="size-1.5 rounded-full bg-gradient-vibrant" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
