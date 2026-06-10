import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Target, Wand2, BookOpen, CreditCard, LayoutTemplate,
  Image as ImageIcon, PenLine, Megaphone, Users, Library, ShieldCheck,
  Sparkles, Zap, Menu, X, LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navBase = [
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
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Você";
  const handleSignOut = async () => { await signOut(); navigate({ to: "/auth" }); };

  return (
    <div className="min-h-screen flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border h-14 flex items-center justify-between px-4">
        <Link to="/app" className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-primary grid place-items-center">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display tracking-tight">OFFERAI</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="size-9 rounded-md border border-border grid place-items-center">
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
          <div className="size-9 rounded-md bg-primary grid place-items-center">
            <Zap className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display tracking-tight leading-none text-lg">OFFERAI</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-[0.22em] mt-1">Edição diária · v1</div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {nav.map((item, i) => {
            if ("section" in item) {
              return (
                <div key={i} className="px-3 pt-5 pb-1.5 text-[9px] uppercase tracking-[0.22em] text-muted-foreground/80 font-semibold">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all group border-l-2",
                  active
                    ? "bg-sidebar-accent text-foreground border-l-primary"
                    : "text-sidebar-foreground border-l-transparent hover:bg-sidebar-accent/60 hover:border-l-border",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-4 mb-6">
          <div className="border border-sidebar-border rounded-md p-4 bg-sidebar-accent/40">
            <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Logado como</div>
            <div className="font-display text-sm mt-1 truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground mt-1">Plano Pro · 8.200 créditos</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="text-[10px] font-bold uppercase tracking-widest py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">
                Créditos
              </button>
              <button onClick={handleSignOut} className="text-[10px] font-bold uppercase tracking-widest py-2 rounded-md border border-border hover:bg-muted flex items-center justify-center gap-1">
                <LogOut className="size-3" /> Sair
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
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
      <div className="min-w-0">
        {eyebrow && (
          <div className="eyebrow mb-3">{eyebrow}</div>
        )}
        <h1 className="font-display text-4xl sm:text-5xl tracking-tighter leading-[0.95]">{title}</h1>
        {description && <p className="text-muted-foreground mt-3 max-w-2xl text-sm sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
