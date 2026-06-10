import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { copyChannels } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PenLine, Copy, RefreshCw, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/copy")({
  component: CopyPage,
});

const samples: Record<string, string[]> = {
  "Facebook Ads": [
    "🚨 Atenção mulher acima dos 30: descobrimos um protocolo japonês de 7 dias que está fazendo elas perderem até 4kg sem academia. Saiba como ↓",
    "Você passou anos tentando emagrecer? O método que funcionou para mais de 12.400 mulheres pode ser sua virada. Toque para conhecer.",
  ],
  WhatsApp: [
    "Oi! Vi que você se interessou pelo Detox 7D. Posso te contar em 30s como funciona? 😊",
    "Última chamada! As 50 vagas com bônus extra fecham hoje às 23h. Posso te enviar o link?",
  ],
};

function CopyPage() {
  const [channel, setChannel] = useState("Facebook Ads");
  const list = samples[channel] ?? [
    `Variação otimizada da copy para ${channel} — gerada pela IA com base na sua oferta.`,
    `Versão alternativa para ${channel}, com gatilho de urgência e prova social.`,
    `Variante curta para ${channel}, ideal para teste A/B.`,
  ];

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
                  channel===c ? "bg-gradient-primary text-primary-foreground shadow-glow" : "hover:bg-secondary",
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
              <div className="text-sm text-muted-foreground">3 variações geradas · Oferta: Detox 7D</div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-sm font-semibold">
              <RefreshCw className="size-4" /> Recriar variações
            </button>
          </Card>

          {list.map((txt, i) => (
            <Card key={i} className="glass border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="border-accent/40 text-accent">Variação {i+1}</Badge>
                <div className="flex gap-1.5">
                  <button className="size-8 rounded-md glass grid place-items-center"><Copy className="size-4" /></button>
                  <button className="size-8 rounded-md glass grid place-items-center"><PenLine className="size-4" /></button>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{txt}</p>
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
