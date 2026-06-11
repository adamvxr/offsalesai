import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, RefreshCw, ChevronRight, FileText, BookOpen, Crown, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { generateEbook } from "@/lib/ai.functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEbooks } from "@/hooks/useResources";

export const Route = createFileRoute("/app/ebook")({
  component: Ebook,
});

const tiers = [
  { id: "simple", label: "Simples", desc: "8 capítulos · ~30 págs", color: "from-muted to-secondary" },
  { id: "premium", label: "Premium", desc: "12 capítulos · ~60 págs", color: "from-primary to-chart-3" },
  { id: "ultra", label: "Ultra Premium", desc: "20 capítulos · ~120 págs", color: "from-chart-3 via-primary to-accent" },
] as const;

type EbookContent = {
  title: string;
  subtitle: string;
  chapters: { title: string; summary: string; content: string }[];
};

function Ebook() {
  const [tier, setTier] = useState<(typeof tiers)[number]["id"]>("premium");
  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState("");
  const [generated, setGenerated] = useState<EbookContent | null>(null);
  const qc = useQueryClient();
  const { data: ebooks = [] } = useEbooks();

  const generateFn = useServerFn(generateEbook);
  const mutation = useMutation({
    mutationFn: async () => generateFn({ data: { title, niche, tier } }),
    onSuccess: (res) => {
      setGenerated(res.ebook as EbookContent);
      qc.invalidateQueries({ queryKey: ["ebooks"] });
      toast.success("Ebook gerado e salvo");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const downloadAsText = () => {
    if (!generated) return;
    const txt = `${generated.title}\n${generated.subtitle}\n\n` +
      generated.chapters.map((c, i) => `Capítulo ${i+1}: ${c.title}\n${c.summary}\n\n${c.content}`).join("\n\n---\n\n");
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${generated.title}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        eyebrow="Passo 3 de 8"
        title="Gerador de Ebook"
        description="A IA cria título, capítulos e conteúdo completo. (20 créditos)"
      />

      <Card className="glass border-border/60 p-5 mb-5">
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
          <Input placeholder="Tema/Título base" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Nicho" value={niche} onChange={(e) => setNiche(e.target.value)} />
          <button
            onClick={() => mutation.mutate()}
            disabled={!title || !niche || mutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />} Gerar Ebook
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
        {tiers.map((t) => (
          <button
            key={t.id}
            onClick={() => setTier(t.id)}
            className={cn(
              "text-left p-5 rounded-xl border transition relative overflow-hidden",
              tier === t.id ? "border-primary glass shadow-glow" : "border-border bg-secondary/40 hover:border-primary/40",
            )}
          >
            <div className={cn("absolute -top-12 -right-12 size-32 blur-3xl rounded-full opacity-50 bg-gradient-to-br", t.color)} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {t.id === "ultra" && <Crown className="size-4 text-warning" />}
                  <div className="font-display font-bold text-lg">{t.label}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{t.desc}</div>
              </div>
              <div className={cn("size-5 rounded-full border-2", tier === t.id ? "border-primary bg-primary" : "border-border")} />
            </div>
          </button>
        ))}
      </div>

      {generated && (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2">
            <Card className="glass border-border/60 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-glow opacity-60" />
              <div className="relative flex items-center justify-center py-8">
                <div className="w-44 h-60 rounded-r-xl rounded-l-sm bg-gradient-to-br from-primary via-chart-3 to-accent shadow-elegant rotate-[-6deg] relative overflow-hidden">
                  <div className="absolute inset-0 p-5 flex flex-col text-primary-foreground">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">Ebook</div>
                    <div className="font-display font-bold text-xl leading-tight mt-2 line-clamp-3">{generated.title}</div>
                    <div className="text-xs opacity-80 mt-1 line-clamp-2">{generated.subtitle}</div>
                  </div>
                </div>
              </div>
              <div className="relative grid grid-cols-2 gap-2 mt-4">
                <button onClick={() => mutation.mutate()} className="py-2.5 rounded-lg glass text-sm font-medium flex items-center justify-center gap-2"><RefreshCw className="size-4" /> Recriar</button>
                <button onClick={downloadAsText} className="py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2"><Download className="size-4" /> Baixar</button>
              </div>
            </Card>
          </div>

          <Card className="glass border-border/60 p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-accent" />
                <div className="font-display font-semibold">Índice gerado</div>
              </div>
              <Badge variant="outline" className="border-accent/40 text-accent">{generated.chapters.length} capítulos</Badge>
            </div>
            <ol className="space-y-1.5 max-h-[480px] overflow-auto">
              {generated.chapters.map((c, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                  <div className="size-7 rounded-md bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shrink-0">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.summary}</div>
                  </div>
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                </li>
              ))}
            </ol>
            <Link to="/app/checkout" className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
              Continuar para Checkout <ChevronRight className="size-4" />
            </Link>
          </Card>
        </div>
      )}

      {!generated && ebooks.length === 0 && !mutation.isPending && (
        <Card className="glass border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Informe título e nicho acima e clique em "Gerar Ebook".
        </Card>
      )}

      {!generated && ebooks.length > 0 && (
        <Card className="glass border-border/60 p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Seus ebooks</div>
          <div className="space-y-2">
            {ebooks.map((e: any) => (
              <button
                key={e.id}
                onClick={() => setGenerated(e.content as EbookContent)}
                className="w-full text-left p-3 rounded-lg bg-secondary/40 border border-border hover:border-primary/40"
              >
                <div className="font-semibold text-sm">{e.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString("pt-BR")}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
