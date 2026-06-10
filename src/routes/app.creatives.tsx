import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { creativeFormats, videoFormats } from "@/lib/mock-data";
import { Image as ImageIcon, Video, Sparkles, RefreshCw, Download, Pencil, ChevronRight, Mic, Wand2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/creatives")({
  component: Creatives,
});

function Creatives() {
  const [tab, setTab] = useState<"img" | "vid">("img");

  return (
    <>
      <PageHeader
        eyebrow="Passo 6 de 8"
        title="Criativos IA"
        description="Gere imagens e vídeos para todas as redes — com roteiro, narração e avatar IA."
      />

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("img")}
          className={cn("px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2", tab==="img"?"bg-gradient-primary text-primary-foreground shadow-glow":"glass")}
        >
          <ImageIcon className="size-4" /> Imagens
        </button>
        <button
          onClick={() => setTab("vid")}
          className={cn("px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2", tab==="vid"?"bg-gradient-primary text-primary-foreground shadow-glow":"glass")}
        >
          <Video className="size-4" /> Vídeos
        </button>
      </div>

      {tab === "img" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creativeFormats.map((f, i) => (
            <Card key={f.id} className="glass border-border/60 p-4 overflow-hidden">
              <div
                className="aspect-square rounded-lg bg-gradient-to-br relative overflow-hidden mb-3"
                style={{
                  background: `linear-gradient(135deg, oklch(0.62 0.24 ${280 + i*15}), oklch(0.72 0.18 ${190 + i*20}))`,
                }}
              >
                <div className="absolute inset-0 p-5 flex flex-col text-primary-foreground">
                  <Badge className="self-start bg-black/40 backdrop-blur-sm border-0 text-[10px] text-primary-foreground">CRIATIVO IA</Badge>
                  <div className="mt-auto">
                    <div className="font-display font-bold text-xl leading-tight">Detox 7D</div>
                    <div className="text-xs opacity-90 mt-1">Perca 4kg em 1 semana</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(1_0_0_/0.25),transparent_60%)]" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.size}</div>
                </div>
                <Sparkles className="size-4 text-accent" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button className="py-2 rounded-md glass text-xs font-medium flex items-center justify-center gap-1"><RefreshCw className="size-3" /></button>
                <button className="py-2 rounded-md glass text-xs font-medium flex items-center justify-center gap-1"><Pencil className="size-3" /></button>
                <button className="py-2 rounded-md bg-gradient-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1"><Download className="size-3" /></button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          <Card className="glass border-border/60 p-5 lg:col-span-2">
            <div className="aspect-[9/16] rounded-xl bg-gradient-to-br from-primary via-chart-3 to-accent relative overflow-hidden">
              <div className="absolute inset-0 grid place-items-center">
                <div className="size-16 rounded-full bg-background/30 backdrop-blur-md grid place-items-center border border-white/20">
                  <Video className="size-7 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
                <div className="font-display font-bold text-xl">Reels · Detox 7D</div>
                <div className="text-xs opacity-90">00:32 · 1080×1920</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button className="py-2.5 rounded-lg glass text-sm font-medium"><RefreshCw className="size-4 mx-auto" /></button>
              <button className="py-2.5 rounded-lg glass text-sm font-medium"><Pencil className="size-4 mx-auto" /></button>
              <button className="py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium"><Download className="size-4 mx-auto" /></button>
            </div>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            <Card className="glass border-border/60 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Formatos</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {videoFormats.map((v) => (
                  <button key={v.id} className="p-3 rounded-lg border border-border bg-secondary/40 hover:border-primary/40 text-left">
                    <div className="font-semibold text-sm">{v.label}</div>
                    <div className="text-xs text-muted-foreground">{v.duration}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="glass border-border/60 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Componentes gerados pela IA</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { icon: Wand2, label: "Roteiro", desc: "Hook + corpo + CTA" },
                  { icon: Mic, label: "Narração", desc: "Voz IA ElevenLabs" },
                  { icon: Sparkles, label: "Avatar IA", desc: "HeyGen / D-ID" },
                  { icon: Video, label: "Legendas", desc: "Sincronizadas word-by-word" },
                ].map((c) => (
                  <div key={c.label} className="p-3 rounded-lg bg-secondary/40 border border-border flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center"><c.icon className="size-4 text-primary-foreground" /></div>
                    <div>
                      <div className="font-semibold text-sm">{c.label}</div>
                      <div className="text-xs text-muted-foreground">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Link to="/app/copy" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
          Continuar para Copywriter <ChevronRight className="size-4" />
        </Link>
      </div>
    </>
  );
}
