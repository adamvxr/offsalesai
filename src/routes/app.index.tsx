import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  TrendingUp, Users, DollarSign, Target, ShoppingBag, Percent, Wallet, Activity,
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

function Kpi({ icon: Icon, label, value, delta, accent }: {
  icon: any; label: string; value: string; delta?: string; accent?: "primary" | "cyan" | "pink" | "green";
}) {
  const ring = {
    primary: "from-primary/30 to-primary/0",
    cyan: "from-accent/30 to-accent/0",
    pink: "from-chart-3/30 to-chart-3/0",
    green: "from-success/30 to-success/0",
  }[accent ?? "primary"];
  return (
    <Card className="relative overflow-hidden glass border-border/60 p-5">
      <div className={`absolute -top-12 -right-12 size-32 bg-gradient-to-br ${ring} blur-2xl rounded-full`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium">{label}</div>
          <div className="font-display font-bold text-2xl mt-1 tracking-tight">{value}</div>
          {delta && (
            <div className="flex items-center gap-1 mt-2 text-xs text-success font-medium">
              <ArrowUpRight className="size-3" /> {delta}
            </div>
          )}
        </div>
        <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Icon className="size-5 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
}

const chartColors = ["oklch(0.62 0.24 295)", "oklch(0.72 0.18 200)", "oklch(0.78 0.2 330)", "oklch(0.78 0.18 75)", "oklch(0.7 0.18 155)"];

function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard Executivo"
        title="Olá, João 👋"
        description="Seu painel em tempo real. A IA já encontrou 3 oportunidades para você hoje."
        actions={
          <Link to="/app/validation" className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-4" /> Nova Oferta
          </Link>
        }
      />

      {/* AI Alerts */}
      <div className="mb-6 glass rounded-xl border border-warning/30 p-4 flex items-start gap-3">
        <div className="size-9 rounded-lg bg-warning/15 grid place-items-center shrink-0">
          <AlertTriangle className="size-4 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">Alerta da IA</div>
          <div className="text-sm text-muted-foreground mt-0.5">
            A oferta <span className="text-foreground font-medium">"Match Perfeito"</span> está abaixo da média (11,4% vs 16,8%). Quer que eu gere uma versão otimizada?
          </div>
        </div>
        <Link to="/app/optimize" className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-vibrant text-primary-foreground shrink-0">
          Otimizar
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <Kpi icon={Target} label="Ofertas Criadas" value={String(kpis.totalOffers)} delta="+4 este mês" accent="primary" />
        <Kpi icon={LayoutTemplate} label="Landing Pages" value={String(kpis.totalLandingPages)} accent="cyan" />
        <Kpi icon={Users} label="Leads Captados" value={kpis.leadsCaptured.toLocaleString("pt-BR")} delta="+18% vs sem. passada" accent="pink" />
        <Kpi icon={ShoppingBag} label="Vendas" value={String(kpis.salesCount)} delta="+24%" accent="green" />
        <Kpi icon={Percent} label="Conversão" value={`${kpis.conversionRate}%`} delta="+2.1 p.p." accent="cyan" />
        <Kpi icon={DollarSign} label="Receita Total" value={fmtBRL(kpis.totalRevenue)} accent="primary" />
        <Kpi icon={Wallet} label="Receita do Mês" value={fmtBRL(kpis.monthRevenue)} delta="+31%" accent="green" />
        <Kpi icon={TrendingUp} label="ROI Estimado" value={`${kpis.roi}x`} delta="ótimo" accent="pink" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2 glass border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display font-semibold">Vendas & Leads · 7 dias</div>
              <div className="text-xs text-muted-foreground mt-0.5">Atualização em tempo real</div>
            </div>
            <Activity className="size-4 text-accent" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesByDay}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.24 295)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 295)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 285 / 0.3)" />
              <XAxis dataKey="day" stroke="oklch(0.68 0.03 285)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.03 285)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 285)", border: "1px solid oklch(0.3 0.03 285)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="leads" stroke="oklch(0.72 0.18 200)" strokeWidth={2} fill="url(#g2)" />
              <Area type="monotone" dataKey="sales" stroke="oklch(0.62 0.24 295)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border-border/60 p-5">
          <div className="font-display font-semibold mb-4">Origem dos Leads</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadSources} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {leadSources.map((_, i) => <Cell key={i} fill={chartColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 285)", border: "1px solid oklch(0.3 0.03 285)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {leadSources.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: chartColors[i] }} />
                  {s.name}
                </div>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="glass border-border/60 p-5 lg:col-span-2">
          <div className="font-display font-semibold mb-4">Conversão por Oferta (%)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={conversionByOffer}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 285 / 0.3)" />
              <XAxis dataKey="name" stroke="oklch(0.68 0.03 285)" fontSize={11} />
              <YAxis stroke="oklch(0.68 0.03 285)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 285)", border: "1px solid oklch(0.3 0.03 285)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" fill="oklch(0.62 0.24 295)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border-border/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="size-4 text-warning" />
            <div className="font-display font-semibold">Top Ofertas</div>
          </div>
          <div className="space-y-3">
            {topOffers.map((o, i) => (
              <div key={o.name} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={`size-9 rounded-lg grid place-items-center font-display font-bold text-sm ${i===0?"bg-gradient-vibrant text-primary-foreground":"bg-muted text-foreground"}`}>
                  {i+1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{o.name}</div>
                  <div className="text-xs text-muted-foreground">{o.sales} vendas</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{fmtBRL(o.revenue)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { to: "/app/validation", icon: Target, label: "Nova Oferta" },
          { to: "/app/creatives", icon: Sparkles, label: "Criar Criativo" },
          { to: "/app/landing", icon: LayoutTemplate, label: "Landing Page" },
          { to: "/app/ebook", icon: Rocket, label: "Gerar Ebook" },
          { to: "/app/checkout", icon: ShoppingBag, label: "Publicar" },
        ].map((s) => (
          <Link key={s.to} to={s.to} className="glass rounded-xl p-4 flex flex-col items-start gap-3 hover:bg-secondary/60 transition group">
            <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition">
              <s.icon className="size-5 text-primary-foreground" />
            </div>
            <div className="text-sm font-semibold">{s.label}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
