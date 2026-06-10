import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { offerTemplates } from "@/lib/mock-data";
import { useState } from "react";
import { Wand2, RefreshCw, Pencil, ChevronRight, Sparkles, ShieldCheck, Gift, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/offer")({
  component: OfferBuilder,
});

function OfferBuilder() {
  const [active, setActive] = useState(0);
  const offer = offerTemplates[active];

  return (
    <>
      <PageHeader
        eyebrow="Passo 2 de 8"
        title="Construtor de Oferta"
        description="A IA gerou 3 versões prontas. Escolha, edite e siga."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2.5 text-sm font-semibold">
            <RefreshCw className="size-4" /> Recriar tudo
          </button>
        }
      />

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[0, 1, 0].map((idx, i) => (
          <button
            key={i}
            onClick={() => setActive(idx)}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm font-semibold shrink-0 transition",
              active === idx ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass",
            )}
          >
            Versão {i + 1}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="glass border-border/60 p-6 lg:col-span-2 space-y-5">
          <div>
            <Badge variant="outline" className="border-accent/40 text-accent mb-2">Big Idea</Badge>
            <p className="font-display font-bold text-xl">{offer.bigIdea}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary/40 border border-border">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-2"><Zap className="size-3" /> Mecanismo único</div>
              <div className="font-semibold">{offer.mechanism}</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/40 border border-border">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-2"><Sparkles className="size-3" /> Promessa</div>
              <div className="font-semibold">{offer.promise}</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-card border border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-60" />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Headline</div>
              <h2 className="font-display font-bold text-2xl leading-tight">{offer.headline}</h2>
              <p className="text-muted-foreground mt-2">{offer.subheadline}</p>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Benefícios</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {offer.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border text-sm">
                  <div className="size-1.5 rounded-full bg-gradient-vibrant" /> {b}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2"><Gift className="size-3" /> Bônus</div>
            <div className="flex flex-wrap gap-2">
              {offer.bonuses.map((b) => (
                <Badge key={b} className="bg-primary/15 text-primary border border-primary/30 font-medium">{b}</Badge>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-success/30 bg-success/5 flex items-center gap-3">
            <ShieldCheck className="size-5 text-success shrink-0" />
            <div className="text-sm font-medium">{offer.guarantee}</div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="glass border-border/60 p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Nome da oferta</div>
            <div className="font-display font-bold text-2xl text-gradient">{offer.name}</div>
          </Card>

          <Card className="glass border-border/60 p-5 space-y-2">
            <button className="w-full flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg glass hover:bg-secondary text-sm font-medium">
              <span className="flex items-center gap-2"><RefreshCw className="size-4" /> Recriar</span>
            </button>
            <button className="w-full flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg glass hover:bg-secondary text-sm font-medium">
              <span className="flex items-center gap-2"><Wand2 className="size-4" /> Melhorar</span>
            </button>
            <button className="w-full flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg glass hover:bg-secondary text-sm font-medium">
              <span className="flex items-center gap-2"><Pencil className="size-4" /> Editar</span>
            </button>
          </Card>

          <Link
            to="/app/ebook"
            className="block w-full text-center px-5 py-4 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow"
          >
            Continuar para Ebook <ChevronRight className="size-4 inline-block" />
          </Link>
        </div>
      </div>
    </>
  );
}
