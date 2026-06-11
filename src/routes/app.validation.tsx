import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TrendingUp, Search, Swords, Sparkles, Wand2, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { validateNiche } from "@/lib/ai.functions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNiches } from "@/hooks/useResources";

export const Route = createFileRoute("/app/validation")({
  component: Validation,
});

type ValidationResult = {
  score: number; classification: string;
  searchVolume: string; competition: string; trend: string; easeOfSale: string;
  searchBar: number; competitionBar: number; trendBar: number; easeBar: number;
  pains: string[]; insight: string;
};

function Validation() {
  const { data: niches = [], isLoading: nichesLoading } = useNiches();
  const [niche, setNiche] = useState<string>("");
  const [pain, setPain] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const activeNiche = niche || niches[0]?.name || "";
  const selectedNiche = niches.find((n: any) => n.name === activeNiche);
  const dbPains: string[] = selectedNiche?.pains ?? [];

  const validateFn = useServerFn(validateNiche);
  const mutation = useMutation({
    mutationFn: async (vars: { niche: string; pain?: string }) => validateFn({ data: vars }),
    onSuccess: (data) => { setResult(data as ValidationResult); toast.success("Validação concluída"); },
    onError: (e: Error) => toast.error(e.message || "Erro ao validar"),
  });

  const score = result?.score ?? 0;
  const classification = result?.classification ?? "—";
  const metrics = result ? [
    { icon: Search, label: "Volume de busca", value: result.searchVolume, bar: result.searchBar },
    { icon: Swords, label: "Concorrência", value: result.competition, bar: result.competitionBar },
    { icon: TrendingUp, label: "Tendência", value: result.trend, bar: result.trendBar },
    { icon: Sparkles, label: "Facilidade de venda", value: result.easeOfSale, bar: result.easeBar },
  ] : [];

  const painList = result?.pains ?? dbPains;

  return (
    <>
      <PageHeader
        eyebrow="Passo 1 de 8"
        title="Validação de Mercado"
        description="A IA valida o nicho com 4 indicadores e devolve um Score 0–100. (5 créditos)"
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Selecione o nicho</div>
            {nichesLoading ? (
              <div className="text-sm text-muted-foreground">Carregando nichos…</div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {niches.map((n: any) => (
                  <button
                    key={n.id}
                    onClick={() => { setNiche(n.name); setResult(null); setPain(null); }}
                    className={cn(
                      "px-3.5 py-2 rounded-lg text-sm font-medium transition",
                      activeNiche === n.name ? "bg-gradient-vibrant text-primary-foreground shadow-glow" : "glass hover:bg-secondary",
                    )}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => mutation.mutate({ niche: activeNiche, pain: pain ?? undefined })}
              disabled={mutation.isPending || !activeNiche}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              Validar com IA
            </button>
          </Card>

          {painList.length > 0 && (
            <Card className="glass border-border/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Principais dores</div>
                <Badge variant="outline" className="border-accent/50 text-accent">
                  {result ? `IA · ${result.pains.length} encontradas` : `Banco · ${dbPains.length}`}
                </Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {painList.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPain(p)}
                    className={cn(
                      "text-left p-3 rounded-lg border transition flex items-center gap-3",
                      pain === p ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/50",
                    )}
                  >
                    <CheckCircle2 className={cn("size-4 shrink-0", pain === p ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{p}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {result && (
            <>
              <Card className="glass border-border/60 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Indicadores de mercado</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <m.icon className="size-4" /> {m.label}
                      </div>
                      <div className="font-display font-bold text-xl mt-1">{m.value}</div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-vibrant rounded-full" style={{ width: `${m.bar}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass border-primary/40 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Insight da IA</div>
                <p className="text-sm leading-relaxed">{result.insight}</p>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-5">
          <Card className="glass border-border/60 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-60" />
            <div className="relative text-center">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Score do nicho</div>
              <div className="my-4 relative inline-block">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="76" fill="none" stroke="oklch(0.22 0.04 285)" strokeWidth="14" />
                  <circle
                    cx="90" cy="90" r="76" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={`${(score/100) * 477} 477`}
                    transform="rotate(-90 90 90)"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="oklch(0.68 0.19 38)" />
                      <stop offset="100%" stopColor="oklch(0.78 0.16 60)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div>
                    <div className="text-5xl font-display font-bold text-gradient">{score}</div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
                <span className="size-1.5 rounded-full bg-success" /> {classification}
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                <span className="font-semibold text-foreground">{activeNiche || "—"}</span>
                {pain && <> · {pain}</>}
              </div>
            </div>
          </Card>

          <Link
            to="/app/offer"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("offerai:seed", JSON.stringify({ niche: activeNiche, pain: pain ?? "" }));
              }
            }}
            className={cn(
              "block text-center w-full px-5 py-4 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition",
              !activeNiche && "opacity-50 pointer-events-none",
            )}
          >
            <Wand2 className="size-4 inline-block mr-2" />
            Gerar Oferta
          </Link>
        </div>
      </div>
    </>
  );
}
