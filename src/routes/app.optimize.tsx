import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Wand2 } from "lucide-react";

export const Route = createFileRoute("/app/optimize")({
  component: Optimize,
});

function Optimize() {
  const score = 72;

  return (
    <>
      <PageHeader
        eyebrow="Otimização"
        title="Melhorar Minha Oferta"
        description="A IA analisa headline, página, criativos, copy e conversão. Em seguida, gera uma versão otimizada."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-vibrant px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Wand2 className="size-4" /> Gerar versão otimizada
          </button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="glass border-border/60 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Nota geral</div>
            <div className="my-3 inline-block relative">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="oklch(0.22 0.04 285)" strokeWidth="12" />
                <circle cx="80" cy="80" r="68" fill="none" stroke="url(#og)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(score/100)*427} 427`} transform="rotate(-90 80 80)" />
                <defs>
                  <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.24 295)" />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 200)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-4xl font-display font-bold text-gradient">{score}</div>
                  <div className="text-xs text-muted-foreground">/ 100</div>
                </div>
              </div>
            </div>
            <Badge className="bg-warning/15 text-warning border border-warning/30">Boa, mas pode melhorar</Badge>
          </div>
        </Card>

        <Card className="glass border-border/60 p-5 lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-success font-semibold text-sm mb-2">
              <CheckCircle2 className="size-4" /> Pontos fortes
            </div>
            <ul className="space-y-1.5 text-sm">
              {[
                "Headline com promessa específica e número",
                "Garantia clara e bem posicionada",
                "Esteira completa: bump + upsell ativos",
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 p-2.5 rounded-md bg-secondary/40 border border-border">
                  <Sparkles className="size-3.5 text-success shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm mb-2">
              <AlertTriangle className="size-4" /> Pontos fracos
            </div>
            <ul className="space-y-1.5 text-sm">
              {[
                "Subheadline genérica, falta especificidade",
                "Provas sociais poucas e sem números",
                "CTA do criativo confunde com texto secundário",
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 p-2.5 rounded-md bg-secondary/40 border border-border">
                  <AlertTriangle className="size-3.5 text-destructive shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-2">
              <TrendingUp className="size-4" /> Sugestões da IA
            </div>
            <ul className="space-y-1.5 text-sm">
              {[
                "Trocar subheadline por: \"sem dieta restritiva, apenas 12 min/dia\"",
                "Adicionar 3 depoimentos em vídeo de alunas reais",
                "Testar headline alternativa: \"4kg em 7 dias com o protocolo japonês\"",
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 p-2.5 rounded-md bg-primary/5 border border-primary/30">
                  <Sparkles className="size-3.5 text-primary shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
}
