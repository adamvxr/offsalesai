import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Globe, Pencil, RefreshCw, Rocket, ChevronRight, Eye, Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateLandingPage } from "@/lib/ai.functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLandingPages, usePublishLanding } from "@/hooks/useResources";

export const Route = createFileRoute("/app/landing")({
  component: Landing,
});

function Landing() {
  const [offerTitle, setOfferTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [primary, setPrimary] = useState("#FF5B1F");
  const [current, setCurrent] = useState<{ id: string; html: string; slug: string } | null>(null);
  const qc = useQueryClient();
  const { data: pages = [] } = useLandingPages();
  const publishMut = usePublishLanding();

  const generateFn = useServerFn(generateLandingPage);
  const mutation = useMutation({
    mutationFn: async () => generateFn({ data: { offerTitle, headline, color: primary, theme: "dark" } }),
    onSuccess: (res) => {
      setCurrent(res);
      qc.invalidateQueries({ queryKey: ["landing_pages"] });
      toast.success("Landing page gerada");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const publish = async () => {
    if (!current) return;
    await publishMut.mutateAsync(current.id);
    toast.success("Landing publicada");
  };

  return (
    <>
      <PageHeader
        eyebrow="Passo 5 de 8"
        title="Landing Page IA"
        description="Página completa de venda gerada em HTML real. (25 créditos)"
        actions={
          current && (
            <button onClick={publish} disabled={publishMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50">
              <Rocket className="size-4" /> Publicar
            </button>
          )
        }
      />

      <Card className="glass border-border/60 p-5 mb-5">
        <div className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center">
          <Input placeholder="Título da oferta" value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} />
          <Input placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-10 w-14 rounded border border-border bg-transparent" />
          <button
            onClick={() => mutation.mutate()}
            disabled={!offerTitle || !headline || mutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />} Gerar
          </button>
        </div>
      </Card>

      {current ? (
        <Card className="glass border-border/60 overflow-hidden p-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-destructive/70" />
              <span className="size-3 rounded-full bg-warning/70" />
              <span className="size-3 rounded-full bg-success/70" />
            </div>
            <div className="flex-1 mx-3 px-3 py-1.5 rounded-md bg-background/60 text-xs font-mono text-muted-foreground flex items-center gap-2">
              <Globe className="size-3" /> {current.slug}.offerai.app
            </div>
            <Eye className="size-4 text-muted-foreground" />
          </div>
          <iframe
            title="Landing preview"
            srcDoc={current.html}
            className="w-full bg-white"
            style={{ height: 720 }}
          />
          <div className="flex items-center gap-2 p-4 border-t border-border">
            <button onClick={() => mutation.mutate()} className="flex-1 py-2.5 rounded-lg glass text-sm font-semibold flex items-center justify-center gap-2"><RefreshCw className="size-4" /> Recriar</button>
            <a
              href={`data:text/html;charset=utf-8,${encodeURIComponent(current.html)}`}
              download={`${current.slug}.html`}
              className="flex-1 py-2.5 rounded-lg glass text-sm font-semibold flex items-center justify-center gap-2"
            ><Pencil className="size-4" /> Baixar HTML</a>
            <Link to="/app/creatives" className="flex-1 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2">
              Próximo <ChevronRight className="size-4" />
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="glass border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Preencha título e headline e clique em "Gerar".
        </Card>
      )}

      {pages.length > 0 && (
        <Card className="glass border-border/60 p-5 mt-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Suas landing pages</div>
          <div className="space-y-2">
            {pages.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setCurrent({ id: p.id, html: p.html, slug: p.slug || p.id })}
                className="w-full text-left p-3 rounded-lg bg-secondary/40 border border-border hover:border-primary/40 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-sm font-mono">{p.slug}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</div>
                </div>
                {p.published && <Badge className="bg-success/15 text-success border border-success/30">Publicada</Badge>}
              </button>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
