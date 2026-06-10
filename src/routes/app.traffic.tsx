import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, Hash, Instagram, Calendar, AlertCircle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/traffic")({
  component: Traffic,
});

const tabs = [
  { id: "wpp", label: "WhatsApp", icon: MessageCircle, color: "text-success" },
  { id: "fb", label: "Facebook", icon: Hash, color: "text-accent" },
  { id: "tg", label: "Telegram", icon: Send, color: "text-accent" },
  { id: "ig", label: "Instagram", icon: Instagram, color: "text-chart-3" },
] as const;

const groupsByChannel: Record<string, { name: string; niche: string; members: string }[]> = {
  wpp: [
    { name: "Renda Extra BR", niche: "Renda Extra", members: "1.024" },
    { name: "Mulheres que Empreendem", niche: "Marketing Digital", members: "832" },
    { name: "Vida Fit & Saudável", niche: "Emagrecimento", members: "1.512" },
  ],
  fb: [
    { name: "Marketing Digital Brasil", niche: "Marketing Digital", members: "48.2k" },
    { name: "Detox & Receitas Fit", niche: "Emagrecimento", members: "22.1k" },
  ],
  tg: [
    { name: "Sinais IA · Renda Extra", niche: "Renda Extra", members: "8.4k" },
    { name: "Canal Detox 7D", niche: "Emagrecimento", members: "3.2k" },
  ],
  ig: [],
};

function Traffic() {
  const [tab, setTab] = useState<"wpp"|"fb"|"tg"|"ig">("wpp");
  const groups = groupsByChannel[tab];

  return (
    <>
      <PageHeader
        eyebrow="Passo 8 de 8"
        title="Central de Tráfego"
        description="Organize grupos, canais e agenda de publicações. A IA respeita as regras de cada plataforma."
      />

      <div className="mb-5 glass rounded-xl border border-warning/30 p-4 flex items-start gap-3">
        <AlertCircle className="size-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="font-semibold">Uso ético</div>
          <div className="text-muted-foreground text-xs mt-0.5">
            A plataforma não envia mensagens em massa nem automatiza ações que violem termos de uso. Tudo aqui é organizacional e respeita as regras de cada rede.
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shrink-0 transition",
              tab===t.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass",
            )}
          >
            <t.icon className={cn("size-4", tab===t.id ? "" : t.color)} /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass border-border/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-semibold">Grupos cadastrados</div>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground">+ Adicionar</button>
            </div>
            <div className="flex gap-2 mb-4">
              <Input placeholder="Nome do grupo / link..." />
              <Input placeholder="Nicho" className="max-w-[180px]" />
            </div>
            <div className="space-y-2">
              {tab === "ig" && (
                <div className="text-sm text-muted-foreground p-6 text-center">
                  No Instagram, a IA gera <span className="text-foreground font-semibold">legendas prontas</span> em texto curto, médio e longo. Não há cadastro de grupos.
                </div>
              )}
              {groups.map((g) => (
                <div key={g.name} className="p-3.5 rounded-lg bg-secondary/40 border border-border flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center">
                    <Hash className="size-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{g.niche} · {g.members} membros</div>
                  </div>
                  <Badge variant="outline" className="border-success/40 text-success">Ativo</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Texto pronto · {tab==="ig"?"Legenda Instagram":"Mensagem para grupo"}</div>
            <div className="grid sm:grid-cols-3 gap-3">
              {["Curto", "Médio", "Longo"].map((s) => (
                <div key={s} className="p-4 rounded-lg bg-secondary/40 border border-border">
                  <Badge className="bg-primary/15 text-primary border border-primary/30 mb-2">{s}</Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s === "Curto"
                      ? "Descobri o método japonês que eliminou minha barriga em 7 dias 👇"
                      : s === "Médio"
                      ? "Eu testei o protocolo japonês de 7 dias e perdi 3,8kg sem academia e sem dieta restritiva. Quem quiser o passo a passo me chama no privado 💬"
                      : "Há 6 meses eu não conseguia perder peso. Testei tudo — dieta, jejum, suplemento. Até que esbarrei no protocolo japonês de 7 dias. Comecei numa segunda e na sexta o ponteiro tinha caído 3,8kg. Compartilho o método com quem pedir."}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass border-border/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="size-4 text-accent" />
              <div className="font-display font-semibold">Agenda de publicações</div>
            </div>
            <div className="space-y-2">
              {[
                { time: "08:30", label: "Story Instagram · Hook"},
                { time: "12:00", label: "Grupo WhatsApp · Mensagem curta"},
                { time: "18:00", label: "Canal Telegram · CTA com bônus"},
                { time: "21:30", label: "Reels · Depoimento aluna"},
              ].map((s) => (
                <div key={s.time} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                  <div className="font-display font-bold text-sm text-primary">{s.time}</div>
                  <div className="text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="font-display font-semibold mb-3">Script de X1 (1:1)</div>
            <div className="space-y-2 text-xs">
              {["Abertura", "Diagnóstico", "Quebra de objeção", "Fechamento"].map((p) => (
                <div key={p} className="flex items-center justify-between p-2.5 rounded-md bg-secondary/40 border border-border">
                  <span className="font-medium">{p}</span>
                  <ChevronRight className="size-3 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>

          <Link to="/app/crm" className="block text-center w-full px-5 py-4 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
            Abrir Mini CRM <ChevronRight className="size-4 inline-block" />
          </Link>
        </div>
      </div>
    </>
  );
}
