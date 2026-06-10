import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Pencil, ChevronRight, FileText, BookOpen, Crown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/ebook")({
  component: Ebook,
});

const tiers = [
  { id: "simple", label: "Simples", desc: "8 capítulos · 30 páginas · 1 capa", color: "from-muted to-secondary" },
  { id: "premium", label: "Premium", desc: "12 capítulos · 60 páginas · capa + mockup 3D", color: "from-primary to-chart-3" },
  { id: "ultra", label: "Ultra Premium", desc: "20 capítulos · 120 páginas · imagens internas + audiobook", color: "from-chart-3 via-primary to-accent" },
] as const;

function Ebook() {
  const [tier, setTier] = useState<(typeof tiers)[number]["id"]>("premium");
  const chapters = [
    "Introdução", "O Método em 3 Passos", "Fundamentos Essenciais",
    "Plano de Ação Diário", "Cardápio Express 7 Dias", "Receitas Termogênicas",
    "Mentalidade Vencedora", "Checklists Imprimíveis", "Próximos Passos",
  ];

  return (
    <>
      <PageHeader
        eyebrow="Passo 3 de 8"
        title="Gerador de Ebook"
        description="Capa, índice, conteúdo, imagens internas e mockup 3D, prontos em minutos."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Download className="size-4" /> Baixar PDF
          </button>
        }
      />

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

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Mockup */}
        <div className="lg:col-span-2">
          <Card className="glass border-border/60 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-60" />
            <div className="relative flex items-center justify-center py-8">
              <div className="relative">
                <div className="w-44 h-60 rounded-r-xl rounded-l-sm bg-gradient-to-br from-primary via-chart-3 to-accent shadow-elegant rotate-[-6deg] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0_/0.2),transparent_50%)]" />
                  <div className="absolute inset-0 p-5 flex flex-col text-primary-foreground">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">Método</div>
                    <div className="font-display font-bold text-2xl leading-tight mt-2">Detox 7D</div>
                    <div className="text-xs opacity-80 mt-1">Protocolo Japonês</div>
                    <div className="mt-auto text-[10px] opacity-70">edição premium</div>
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/40" />
                </div>
                <div className="absolute -bottom-3 left-4 right-4 h-4 bg-black/40 blur-md rounded-full" />
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-2 mt-4">
              <button className="py-2.5 rounded-lg glass text-sm font-medium flex items-center justify-center gap-2"><RefreshCw className="size-4" /> Recriar</button>
              <button className="py-2.5 rounded-lg glass text-sm font-medium flex items-center justify-center gap-2"><Pencil className="size-4" /> Editar</button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2"><Download className="size-4" /> PDF</button>
            <button className="py-3 rounded-xl glass text-sm font-semibold flex items-center justify-center gap-2"><Download className="size-4" /> EPUB</button>
          </div>
        </div>

        {/* Index */}
        <Card className="glass border-border/60 p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-accent" />
              <div className="font-display font-semibold">Índice gerado</div>
            </div>
            <Badge variant="outline" className="border-accent/40 text-accent">12 capítulos · 60 págs</Badge>
          </div>
          <ol className="space-y-1.5">
            {chapters.map((c, i) => (
              <li key={c} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                <div className="size-7 rounded-md bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground">{i+1}</div>
                <div className="flex-1 text-sm font-medium">{c}</div>
                <FileText className="size-4 text-muted-foreground" />
              </li>
            ))}
          </ol>

          <Link to="/app/checkout" className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
            Continuar para Checkout <ChevronRight className="size-4" />
          </Link>
        </Card>
      </div>
    </>
  );
}
