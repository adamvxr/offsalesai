import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { landingTemplates } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Globe, Pencil, RefreshCw, Rocket, ChevronRight, Eye } from "lucide-react";

export const Route = createFileRoute("/app/landing")({
  component: Landing,
});

const sections = ["Headline", "Subheadline", "CTA", "Vídeo", "Benefícios", "Provas", "Depoimentos", "FAQ", "Garantia", "Rodapé"];

function Landing() {
  const [tpl, setTpl] = useState("premium");
  const [primary, setPrimary] = useState("#7C3AED");

  return (
    <>
      <PageHeader
        eyebrow="Passo 5 de 8"
        title="Landing Page IA"
        description="Página completa de venda gerada e publicada em subdomínio próprio."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Rocket className="size-4" /> Publicar
          </button>
        }
      />

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Templates</div>
            <div className="space-y-2">
              {landingTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTpl(t.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition",
                    tpl === t.id ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/40",
                  )}
                >
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Personalização</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Cor primária</div>
                <div className="flex gap-2 flex-wrap">
                  {["#7C3AED","#06B6D4","#F0ABFC","#10B981","#F59E0B","#EF4444"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPrimary(c)}
                      className={cn("size-8 rounded-lg border-2 transition", primary===c?"border-foreground scale-110":"border-border")}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Fonte</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="p-2 rounded-lg border border-primary bg-primary/10 font-semibold">Inter</button>
                  <button className="p-2 rounded-lg border border-border">Manrope</button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Seções incluídas</div>
            <div className="flex flex-wrap gap-1.5">
              {sections.map((s) => <Badge key={s} variant="outline" className="text-[10px] border-border">{s}</Badge>)}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="glass border-border/60 overflow-hidden p-0">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-destructive/70" />
                <span className="size-3 rounded-full bg-warning/70" />
                <span className="size-3 rounded-full bg-success/70" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1.5 rounded-md bg-background/60 text-xs font-mono text-muted-foreground flex items-center gap-2">
                <Globe className="size-3" /> detox7d.offerai.app
              </div>
              <Eye className="size-4 text-muted-foreground" />
            </div>

            {/* Live preview */}
            <div className="p-6 sm:p-10 bg-background/40">
              <div className="text-center max-w-2xl mx-auto">
                <Badge style={{ background: `${primary}20`, color: primary, borderColor: `${primary}50` }} variant="outline">
                  Método Exclusivo
                </Badge>
                <h2 className="font-display font-bold text-3xl sm:text-5xl mt-4 leading-tight tracking-tight">
                  Perca <span style={{ color: primary }}>4kg em 7 dias</span> com o protocolo japonês
                </h2>
                <p className="text-muted-foreground mt-4">Sem dieta restritiva, sem academia. Apenas 12 minutos por dia.</p>
                <button
                  className="mt-6 px-6 py-3.5 rounded-xl text-primary-foreground font-bold text-sm shadow-glow"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${primary}cc)` }}
                >
                  QUERO COMEÇAR AGORA →
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-10">
                {["+12.4k alunos", "Nota 4.9/5", "Aprovado por nutris"].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card/60 border border-border text-center text-sm font-semibold">{s}</div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 border-t border-border">
              <button className="flex-1 py-2.5 rounded-lg glass text-sm font-semibold flex items-center justify-center gap-2"><Pencil className="size-4" /> Editar</button>
              <button className="flex-1 py-2.5 rounded-lg glass text-sm font-semibold flex items-center justify-center gap-2"><RefreshCw className="size-4" /> Recriar</button>
              <Link to="/app/creatives" className="flex-1 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2">
                Próximo <ChevronRight className="size-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
