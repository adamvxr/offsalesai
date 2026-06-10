import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminUsers } from "@/lib/mock-data";
import { Users, Wallet, Activity, Layers } from "lucide-react";

export const Route = createFileRoute("/app/admin")({
  component: Admin,
});

const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const planColor: Record<string, string> = {
  Free: "border-border text-muted-foreground",
  Starter: "border-accent/40 text-accent",
  Pro: "border-primary/40 text-primary",
  Agency: "border-warning/40 text-warning",
};

function Admin() {
  const mrr = adminUsers.reduce((s, u) => s + u.mrr, 0);
  const credits = adminUsers.reduce((s, u) => s + u.credits, 0);

  return (
    <>
      <PageHeader
        eyebrow="Área Administrativa"
        title="Painel do Admin"
        description="Controle usuários, planos, créditos IA e métricas do SaaS."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Users, label: "Usuários ativos", value: String(adminUsers.length) },
          { icon: Wallet, label: "MRR estimado", value: fmtBRL(mrr * 5.2) },
          { icon: Layers, label: "Créditos IA ativos", value: credits.toLocaleString("pt-BR") },
          { icon: Activity, label: "Logs / 24h", value: "12.4k" },
        ].map((k) => (
          <Card key={k.label} className="glass border-border/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="font-display font-bold text-2xl mt-1">{k.value}</div>
              </div>
              <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
                <k.icon className="size-5 text-primary-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass border-border/60 p-5">
        <div className="font-display font-semibold mb-4">Usuários</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-2 font-medium">Nome</th>
                <th className="py-2 font-medium">Plano</th>
                <th className="py-2 font-medium text-right">Créditos</th>
                <th className="py-2 font-medium text-right">MRR</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className={planColor[u.plan]}>{u.plan}</Badge>
                  </td>
                  <td className="py-3 text-right tabular-nums">{u.credits.toLocaleString("pt-BR")}</td>
                  <td className="py-3 text-right tabular-nums font-semibold">{fmtBRL(u.mrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid sm:grid-cols-4 gap-3 mt-6">
        {[
          { name: "Free", price: "R$0", limit: "3 ofertas/mês" },
          { name: "Starter", price: "R$49", limit: "50 ofertas/mês" },
          { name: "Pro", price: "R$97", limit: "Ilimitado" },
          { name: "Agency", price: "R$297", limit: "Multiusuário + White Label" },
        ].map((p, i) => (
          <Card key={p.name} className={`glass border-border/60 p-5 ${i===2?"glow-ring":""}`}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.name}</div>
            <div className="font-display font-bold text-2xl mt-1">{p.price}<span className="text-sm text-muted-foreground font-normal">/mês</span></div>
            <div className="text-xs text-muted-foreground mt-2">{p.limit}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
