import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import {
  TrendingUp, Users, DollarSign, Target, ShoppingBag, Wallet,
  Plus, Sparkles, LayoutTemplate, Rocket, ArrowUpRight, BookOpen, Image as ImageIcon,
} from "lucide-react";
import { useDashboardStats, useProfile } from "@/hooks/useResources";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function StatTile({
  label, value, icon: Icon, big,
}: { label: string; value: string; icon: any; big?: boolean }) {
  return (
    <div className="bento p-5 flex flex-col justify-between min-h-[140px]">
      <div className="flex items-start justify-between">
        <div className="eyebrow">{label}</div>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <div className={`font-display tracking-tight ${big ? "text-4xl sm:text-5xl" : "text-3xl"} mt-2`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: profile } = useProfile();

  const firstName = (profile?.display_name || user?.email?.split("@")[0] || "criador").split(" ")[0];
  const noData = !isLoading && stats && stats.totalOffers === 0 && stats.totalLeads === 0;

  return (
    <>
      <PageHeader
        eyebrow="Editorial · diário"
        title={`Bom dia, ${firstName}.`}
        description={noData ? "Você ainda não tem dados. Comece criando sua primeira oferta." : "Resumo em tempo real do seu negócio."}
        actions={
          <Link
            to="/app/validation"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition"
          >
            <Plus className="size-4" /> Nova Oferta
          </Link>
        }
      />

      <div className="grid grid-cols-6 auto-rows-[minmax(140px,auto)] gap-3 sm:gap-4">
        {/* Hero KPI */}
        <div className="col-span-6 md:col-span-4 bento p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, oklch(0.68 0.19 38), transparent 50%)" }} />
          <div className="relative">
            <div className="eyebrow">Receita acumulada</div>
            <div className="flex items-end gap-4 mt-2 flex-wrap">
              <div className="font-display text-5xl sm:text-7xl tracking-tighter leading-none">
                {fmtBRL(stats?.totalRevenue ?? 0)}
              </div>
              <div className="pb-2">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                  <ArrowUpRight className="size-3" /> ao vivo
                </div>
              </div>
            </div>
            <div className="ember-line my-5 max-w-xs" />
            <p className="text-sm text-muted-foreground max-w-md">
              {noData
                ? "Você ainda não possui dados. Crie sua primeira oferta para ver os números aqui."
                : `${stats?.salesCount ?? 0} vendas registradas · ${stats?.totalLeads ?? 0} leads no funil.`}
            </p>
          </div>
        </div>

        <div className="col-span-3 md:col-span-2 bento p-5 flex flex-col justify-between bg-primary text-primary-foreground border-primary">
          <div className="flex items-start justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Créditos IA</div>
            <Wallet className="size-4" />
          </div>
          <div>
            <div className="font-display text-5xl tracking-tighter">{profile?.credits ?? 0}</div>
            <div className="text-xs opacity-80 mt-1">Plano: {profile?.plan ?? "free"}</div>
          </div>
        </div>

        <StatTile label="Ofertas" value={String(stats?.totalOffers ?? 0)} icon={Target} />
        <StatTile label="Landings" value={String(stats?.totalLandings ?? 0)} icon={LayoutTemplate} />
        <StatTile label="Ebooks" value={String(stats?.totalEbooks ?? 0)} icon={BookOpen} />
        <StatTile label="Criativos" value={String(stats?.totalCreatives ?? 0)} icon={ImageIcon} />
        <StatTile label="Leads" value={String(stats?.totalLeads ?? 0)} icon={Users} />
        <StatTile label="Vendas" value={String(stats?.salesCount ?? 0)} icon={ShoppingBag} />

        <div className="col-span-6 lg:col-span-4 bento p-5 row-span-2">
          <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Receita por produto</div>
              <div className="font-display text-2xl mt-1">Conversão real</div>
            </div>
          </div>
          {noData ? (
            <div className="grid place-items-center h-64 text-center">
              <div>
                <div className="font-display text-2xl mb-2">Sem dados ainda</div>
                <p className="text-sm text-muted-foreground mb-4">Crie sua primeira oferta e configure um checkout para começar a ver receita.</p>
                <Link to="/app/validation" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  <Plus className="size-4" /> Começar agora
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-5 rounded-xl bg-secondary/40 border border-border">
                <div className="eyebrow">Total leads</div>
                <div className="font-display text-3xl mt-2">{stats?.totalLeads ?? 0}</div>
              </div>
              <div className="p-5 rounded-xl bg-secondary/40 border border-border">
                <div className="eyebrow">Vendas</div>
                <div className="font-display text-3xl mt-2">{stats?.salesCount ?? 0}</div>
              </div>
              <div className="p-5 rounded-xl bg-secondary/40 border border-border">
                <div className="eyebrow">Receita</div>
                <div className="font-display text-3xl mt-2">{fmtBRL(stats?.totalRevenue ?? 0)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-6 lg:col-span-2 bento p-5">
          <div className="eyebrow">Performance IA</div>
          <div className="font-display text-2xl mt-1 mb-3">Conteúdo gerado</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Ofertas</span><span className="font-bold">{stats?.totalOffers ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ebooks</span><span className="font-bold">{stats?.totalEbooks ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Landings</span><span className="font-bold">{stats?.totalLandings ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Criativos</span><span className="font-bold">{stats?.totalCreatives ?? 0}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="eyebrow">Atalhos</div>
          <div className="flex-1 ember-line" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { to: "/app/validation", icon: Target, label: "Nova Oferta" },
            { to: "/app/creatives", icon: Sparkles, label: "Criar Criativo" },
            { to: "/app/landing", icon: LayoutTemplate, label: "Landing Page" },
            { to: "/app/ebook", icon: Rocket, label: "Gerar Ebook" },
            { to: "/app/checkout", icon: ShoppingBag, label: "Checkout" },
          ].map((s) => (
            <Link key={s.to} to={s.to} className="bento p-4 flex items-center gap-3 group">
              <div className="size-10 rounded-md bg-muted grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                <s.icon className="size-5" />
              </div>
              <div className="text-sm font-bold">{s.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
