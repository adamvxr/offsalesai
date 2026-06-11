import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Video, Sparkles, RefreshCw, Download, ChevronRight, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { generateCreative } from "@/lib/ai.functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreatives } from "@/hooks/useResources";

export const Route = createFileRoute("/app/creatives")({
  component: Creatives,
});

const types = [
  { id: "instagram_post", label: "Post Instagram", icon: ImageIcon },
  { id: "instagram_story", label: "Story", icon: ImageIcon },
  { id: "reels_script", label: "Roteiro Reels", icon: Video },
  { id: "vsl_script", label: "Roteiro VSL", icon: Video },
  { id: "google_ad", label: "Google Ads", icon: Sparkles },
] as const;

function Creatives() {
  const [type, setType] = useState<(typeof types)[number]["id"]>("instagram_post");
  const [offerTitle, setOfferTitle] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const qc = useQueryClient();
  const { data: creatives = [] } = useCreatives();

  const generateFn = useServerFn(generateCreative);
  const mutation = useMutation({
    mutationFn: async () => generateFn({ data: { offerTitle, type } }),
    onSuccess: (res) => {
      setCurrent(res.content);
      qc.invalidateQueries({ queryKey: ["creatives"] });
      toast.success("Criativo gerado e salvo");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const download = () => {
    if (!current) return;
    const blob = new Blob([current], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${type}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        eyebrow="Passo 6 de 8"
        title="Criativos IA"
        description="Posts, stories, roteiros de Reels e VSL — gerados pela IA. (15 créditos)"
      />

      <Card className="glass border-border/60 p-5 mb-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Tipo de criativo</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={cn("px-3.5 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2",
                type === t.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass")}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <Input placeholder="Título da oferta" value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} />
          <button
            onClick={() => mutation.mutate()}
            disabled={!offerTitle || mutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />} Gerar
          </button>
        </div>
      </Card>

      {current && (
        <Card className="glass border-border/60 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-accent/15 text-accent border border-accent/30">{type}</Badge>
            <div className="flex gap-2">
              <button onClick={() => mutation.mutate()} className="px-3 py-1.5 rounded-lg glass text-xs font-medium inline-flex items-center gap-1.5"><RefreshCw className="size-3" /> Recriar</button>
              <button onClick={download} className="px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"><Download className="size-3" /> Baixar</button>
            </div>
          </div>
          <pre className="text-sm whitespace-pre-wrap font-sans p-4 rounded-lg bg-secondary/40 border border-border max-h-[480px] overflow-auto">{current}</pre>
        </Card>
      )}

      {creatives.length > 0 && (
        <Card className="glass border-border/60 p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Histórico</div>
          <div className="space-y-2">
            {creatives.slice(0, 10).map((c: any) => (
              <button
                key={c.id}
                onClick={() => { setCurrent(c.content); setType(c.type); }}
                className="w-full text-left p-3 rounded-lg bg-secondary/40 border border-border hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{c.prompt || "(sem título)"}</div>
                  <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{c.content}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 flex justify-end">
        <Link to="/app/copy" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
          Continuar para Copywriter <ChevronRight className="size-4" />
        </Link>
      </div>
    </>
  );
}
