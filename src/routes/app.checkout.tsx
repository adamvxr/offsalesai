import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { checkoutPlatforms } from "@/lib/mock-data";
import { useState } from "react";
import { CreditCard, ChevronRight, ShoppingCart, ArrowUpCircle, ArrowDownCircle, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/checkout")({
  component: Checkout,
});

function Checkout() {
  const [platform, setPlatform] = useState("Kiwify");
  const items = [
    { icon: ShoppingCart, label: "Checkout Principal", desc: "Página otimizada com selos e gatilhos", enabled: true },
    { icon: ShoppingBag, label: "Order Bump", desc: "Oferta de R$27 no checkout (+18% AOV)", enabled: true },
    { icon: ArrowUpCircle, label: "Upsell", desc: "Versão Premium por R$197 com 1-click", enabled: true },
    { icon: ArrowDownCircle, label: "Downsell", desc: "Plano parcelado se recusar upsell", enabled: false },
    { icon: ShoppingCart, label: "Cross-sell", desc: "Combo de produtos complementares", enabled: false },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Passo 4 de 8"
        title="Checkout & Monetização"
        description="Conecte sua plataforma, defina preços e gere a esteira de monetização inteira em 1 clique."
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Plataforma</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {checkoutPlatforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "p-4 rounded-xl border transition text-sm font-semibold",
                    platform === p ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-secondary/40 hover:border-primary/40",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Preço & Garantia</div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs mb-1.5 block">Valor da Oferta</Label>
                <Input defaultValue="R$ 97,00" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Parcelamento</Label>
                <Input defaultValue="12x sem juros" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Garantia</Label>
                <Input defaultValue="30 dias" />
              </div>
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Esteira automática</div>
            <div className="space-y-2.5">
              {items.map((it) => (
                <div key={it.label} className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center shrink-0">
                    <it.icon className="size-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{it.label}</div>
                    <div className="text-xs text-muted-foreground">{it.desc}</div>
                  </div>
                  <Switch defaultChecked={it.enabled} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass border-border/60 p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-60" />
            <div className="relative">
              <CreditCard className="size-5 text-accent mb-3" />
              <div className="font-display font-bold text-xl">Conectado via API</div>
              <div className="text-sm text-muted-foreground mt-1">{platform}</div>
              <div className="mt-4 p-3 rounded-lg bg-secondary/60 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-success font-semibold">Ativo</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Webhook</span><span className="font-mono">/wh/kiwify</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">URL</span><span className="font-mono">.com/co</span></div>
              </div>
            </div>
          </Card>
          <Link to="/app/landing" className="block text-center w-full px-5 py-4 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
            Gerar Landing Page <ChevronRight className="size-4 inline-block" />
          </Link>
        </div>
      </div>
    </>
  );
}
