import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { copyChannels } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, RefreshCw, ChevronRight, Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateCopy } from "@/lib/ai.functions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/app/copy")({
  component: CopyPage,
});

type StoredOffer = { name: string; bigIdea: string; promise: string };

function CopyPage() {
  const [channel, setChannel] = useState("Facebook Ads");
  const [offer, setOffer] = useState<StoredOffer | null>(null);
  const [variations, setVariations] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("offerai:offer");
    if (raw) {
      try { setOffer(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const fn = useServerFn(generateCopy);
  const mutation = useMutation({
    mutationFn: async (vars: { channel: string }) =>
      fn({ data: { channel: vars.channel, offerTitle: offer?.name ?? "Oferta", bigIdea: offer?.bigIdea, promise: offer?.promise } }),
    onSuccess: (res, vars) => {
      setVariations((v) => ({ ...v, [vars.channel]: (res as { variations: string[] }).variations }));
    },
    onError: (e: Error) => toast.error(e.message || "Falha ao gerar copy"),
  });

  const list = variations[channel];

  return (
    <>
      <PageHeader
        eyebrow="Passo 7 de 8"
        title="Copywriter IA"
        description="Toda a copy para todos os canais — ads, mensagens, fechamento e quebra de objeções."
      />

      <div className="grid lg:grid-cols-4 gap-5">
        <Card className="glass border-border/60 p-4 lg:col-span-1 h-fit lg:sticky lg:top-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">Canais</div>
          <div className="space-y-0.5">
            {copyChannels.map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition",
                  channel===c ? "bg-gradient-vibrant text-primary-foreground shadow-glow" : "hover:bg-secondary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <Card className="glass border-border/60 p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display font-bold text-xl">{channel}</div>
              <div className="text-sm text-muted-foreground">
                Oferta: {offer?.name ?? <span className="italic">nenhuma selecionada — gere uma na etapa anterior</span>}
              </div>
            </div>
            <button
              onClick={() => mutation.mutate({ channel })}
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : list ? <RefreshCw className="size-4" /> : <Wand2 className="size-4" />}
              {list ? "Recriar variações" : "Gerar com IA"}
            </button>
          </Card>

          {!list && !mutation.isPending && (
            <Card className="glass border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Clique em "Gerar com IA" para criar 3 variações de copy para {channel}.
            </Card>
          )}

          {list?.map((txt, i) => (
            <Card key={i} className="glass border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="border-accent/40 text-accent">Variação {i+1}</Badge>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { navigator.clipboard.writeText(txt); toast.success("Copiado"); }}
                    className="size-8 rounded-md glass grid place-items-center"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{txt}</p>
            </Card>
          ))}

          <div className="flex justify-end">
            <Link to="/app/traffic" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
              Continuar para Tráfego <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
