import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { RefreshCw, ChevronRight, Sparkles, ShieldCheck, Gift, Zap, Wand2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateOffer } from "@/lib/ai.functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/app/offer")({
  component: OfferBuilder,
});

type Offer = {
  name: string; bigIdea: string; mechanism: string; promise: string;
  headline: string; subheadline: string; benefits: string[]; bonuses: string[];
  guarantee: string; priceSuggestion: string;
};

function OfferBuilder() {
  const [niche, setNiche] = useState("");
  const [pain, setPain] = useState("");
  const [offer, setOffer] = useState<Offer | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("offerai:seed");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setNiche(parsed.niche || "");
        setPain(parsed.pain || "");
      } catch { /* ignore */ }
    }
  }, []);

  const generateFn = useServerFn(generateOffer);
  const mutation = useMutation({
    mutationFn: async (vars: { niche: string; pain?: string }) => generateFn({ data: vars }),
    onSuccess: (res) => {
      setOffer(res.offer as Offer);
      qc.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Oferta criada e salva na biblioteca");
    },
    onError: (e: Error) => toast.error(e.message || "Falha ao gerar"),
  });

  return (
    <>
      <PageHeader
        eyebrow="Passo 2 de 8"
        title="Construtor de Oferta"
        description="A IA cria uma oferta completa: Big Idea, mecanismo, headline, bônus e garantia."
        actions={
          offer && (
            <button
              onClick={() => mutation.mutate({ niche, pain: pain || undefined })}
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2.5 text-sm font-semibold"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Recriar
            </button>
          )
        }
      />

      <Card className="glass border-border/60 p-5 mb-5">
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
          <Input placeholder="Nicho (ex: Emagrecimento)" value={niche} onChange={(e) => setNiche(e.target.value)} />
          <Input placeholder="Dor central (opcional)" value={pain} onChange={(e) => setPain(e.target.value)} />
          <button
            onClick={() => mutation.mutate({ niche, pain: pain || undefined })}
            disabled={!niche || mutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />} Gerar com IA
          </button>
        </div>
      </Card>

      {!offer && !mutation.isPending && (
        <Card className="glass border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Informe o nicho acima e clique em "Gerar com IA".
        </Card>
      )}

      {mutation.isPending && !offer && (
        <Card className="glass border-border/60 p-10 grid place-items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <div className="text-sm text-muted-foreground">A IA está criando sua oferta…</div>
        </Card>
      )}

      {offer && (
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

            <Card className="glass border-border/60 p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Preço sugerido</div>
              <div className="font-display font-bold text-3xl">{offer.priceSuggestion}</div>
            </Card>

            <Link
              to="/app/copy"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("offerai:offer", JSON.stringify(offer));
                }
              }}
              className="block w-full text-center px-5 py-4 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow"
            >
              Continuar para Copy <ChevronRight className="size-4 inline-block" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
