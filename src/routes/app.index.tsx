import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  TrendingUp, Users, DollarSign, Target, ShoppingBag, Percent, Wallet,
  Trophy, Plus, Sparkles, LayoutTemplate, Rocket, AlertTriangle, ArrowUpRight,
} from "lucide-react";
import {
  kpis, salesByDay, conversionByOffer, leadSources, topOffers,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const chartColors = [
  "oklch(0.68 0.19 38)",
  "oklch(0.78 0.13 80)",
  "oklch(0.55 0.005 60)",
  "oklch(0.72 0.14 155)",
  "oklch(0.4 0.005 60)",
];

function StatTile({
  label, value, delta, icon: Icon, big,
}: { label: string; value: string; delta?: string; icon: any; big?: boolean }) {
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
        {delta && (
          <div className="flex items-center gap-1 mt-2 text-xs text-primary font-semibold">
            <ArrowUpRight className="size-3" /> {delta}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="N.º 042 — Edição diária"
        title="Bom dia, João."
        description="Três oportunidades novas hoje. Uma campanha pede sua atenção."
        actions={
          <Link
            to="/app/validation"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition"
          >
            <Plus className="size-4" /> Nova Oferta
          </Link>
        }
      />

      {/* Alert strip */}
      <div className="bento p-0 mb-6 overflow-hidden flex flex-col sm:flex-row items-stretch border-l-4 border-l-primary">
        <div className="flex items-center gap-3 px-5 py-4 flex-1 min-w-0">
          <AlertTriangle className="size-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="eyebrow mb-1">Alerta · IA</div>
            <div className="text-sm">
              <span className="font-semibold">Match Perfeito</span> está convertendo 11,4% (média 16,8%). Posso gerar uma versão otimizada.
            </div>
          </div>
        </div>
        <Link
          to="/app/optimize"
          className="px-5 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest flex items-center justify-center sm:border-l border-t sm:border-t-0 border-primary/40 hover:opacity-90"
        >
          Otimizar →
        </Link>
      </div>

      {/* BENTO — main grid */}
      <div className="grid grid-cols-6 auto-rows-[minmax(140px,auto)] gap-3 sm:gap-4">
        {/* Hero KPI */}
        <div className="col-span-6 md:col-span-4 bento p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, oklch(0.68 0.19 38), transparent 50%)" }} />
          <div className="relative">
            <div className="eyebrow">Receita · este mês</div>
            <div className="flex items-end gap-4 mt-2 flex-wrap">
              <div className="font-display text-5xl sm:text-7xl tracking-tighter leading-none">
                {fmtBRL(kpis.monthRevenue)}
              </div>
              <div className="pb-2">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                  <ArrowUpRight className="size-3" /> +31%
                </div>
              </div>
            </div>
            <div className="ember-line my-5 max-w-xs" />
            <p className="text-sm text-muted-foreground max-w-md">
              ROI {kpis.roi}x acima da média do nicho. Sua melhor semana desde a abertura da conta.
            </p>
          </div>
        </div>

        <div className="col-span-3 md:col-span-2 bento p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="eyebrow">Conversão</div>
            <Percent className="size-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-display text-5xl tracking-tighter">{kpis.conversionRate}<span className="text-2xl text-muted-foreground">%</span></div>
            <div className="text-xs text-primary font-semibold mt-1">+2.1 p.p.</div>
          </div>
        </div>

        <StatTile label="Ofertas" value={String(kpis.totalOffers)} delta="+4 este mês" icon={Target} />
        <StatTile label="Landings" value={String(kpis.totalLandingPages)} icon={LayoutTemplate} />
        <StatTile label="Leads" value={kpis.leadsCaptured.toLocaleString("pt-BR")} delta="+18%" icon={Users} />
        <StatTile label="Vendas" value={String(kpis.salesCount)} delta="+24%" icon={ShoppingBag} />
        <StatTile label="Receita Total" value={fmtBRL(kpis.totalRevenue)} icon={DollarSign} />
        <StatTile label="ROI" value={`${kpis.roi}x`} delta="ótimo" icon={TrendingUp} />

        {/* Chart — Sales & Leads */}
        <div className="col-span-6 lg:col-span-4 bento p-5 row-span-2">
          <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Performance · 7 dias</div>
              <div className="font-display text-2xl mt-1">Vendas & Leads</div>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" /> Vendas</div>
              <div className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-chart-2" /> Leads</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesByDay} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.19 38)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="oklch(0.68 0.19 38)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.13 80)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.78 0.13 80)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="day" stroke="oklch(0.66 0.012 60)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.66 0.012 60)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.003 60)", border: "1px solid oklch(0.3 0.005 60)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="leads" stroke="oklch(0.78 0.13 80)" strokeWidth={2} fill="url(#gLeads)" />
              <Area type="monotone" dataKey="sales" stroke="oklch(0.68 0.19 38)" strokeWidth={2.5} fill="url(#gSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead sources */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 bento p-5">
          <div className="eyebrow">Origem dos leads</div>
          <div className="font-display text-2xl mt-1 mb-3">Tráfego</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={leadSources} dataKey="value" innerRadius={42} outerRadius={68} paddingAngle={2} stroke="none">
                {leadSources.map((_, i) => <Cell key={i} fill={chartColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.18 0.003 60)", border: "1px solid oklch(0.3 0.005 60)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {leadSources.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-sm" style={{ background: chartColors[i] }} />
                  {s.name}
                </div>
                <span className="text-muted-foreground tabular-nums">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top offers */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 bento p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Ranking</div>
              <div className="font-display text-2xl mt-1">Top Ofertas</div>
            </div>
            <Trophy className="size-4 text-primary" />
          </div>
          <div className="mt-4 divide-y divide-border">
            {topOffers.map((o, i) => (
              <div key={o.name} className="flex items-center gap-3 py-3">
                <div className="font-display text-xl text-muted-foreground tabular-nums w-6">
                  {String(i+1).padStart(2,"0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{o.name}</div>
                  <div className="text-xs text-muted-foreground">{o.sales} vendas</div>
                </div>
                <div className="text-sm font-bold tabular-nums">{fmtBRL(o.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion bar chart */}
        <div className="col-span-6 lg:col-span-4 bento p-5">
          <div className="flex items-end justify-between mb-2 flex-wrap gap-2">
            <div>
              <div className="eyebrow">Por oferta</div>
              <div className="font-display text-2xl mt-1">Conversão (%)</div>
            </div>
            <div className="text-xs text-muted-foreground">Últimos 30 dias</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionByOffer} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.66 0.012 60)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.66 0.012 60)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "oklch(1 0 0 / 0.04)" }} contentStyle={{ background: "oklch(0.18 0.003 60)", border: "1px solid oklch(0.3 0.005 60)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="oklch(0.68 0.19 38)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wallet card */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 bento p-5 flex flex-col justify-between bg-primary text-primary-foreground border-primary">
          <div className="flex items-start justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Carteira</div>
            <Wallet className="size-4" />
          </div>
          <div>
            <div className="font-display text-4xl tracking-tighter">{fmtBRL(kpis.totalRevenue)}</div>
            <div className="text-xs opacity-80 mt-1">Saldo disponível para saque</div>
            <button className="mt-4 w-full bg-background text-foreground text-xs font-bold uppercase tracking-widest py-2.5 rounded-md hover:opacity-90 transition">
              Sacar agora
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions — magazine footer */}
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
            { to: "/app/checkout", icon: ShoppingBag, label: "Publicar" },
          ].map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="bento p-4 flex items-center gap-3 group"
            >
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
