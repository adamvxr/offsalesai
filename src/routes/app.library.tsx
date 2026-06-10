import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { winningOffers } from "@/lib/mock-data";
import { Bookmark, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/app/library")({
  component: Library,
});

function Library() {
  return (
    <>
      <PageHeader
        eyebrow="Inspiração"
        title="Biblioteca de Ofertas Vencedoras"
        description="Estudos de caso reais organizados por nicho. Use como referência para suas próximas ofertas."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {winningOffers.map((o, i) => (
          <Card key={i} className="glass border-border/60 p-5 hover:border-primary/40 transition group">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-primary/15 text-primary border border-primary/30">{o.niche}</Badge>
              <button className="size-8 rounded-md glass grid place-items-center opacity-60 group-hover:opacity-100">
                <Bookmark className="size-4" />
              </button>
            </div>
            <h3 className="font-display font-bold text-lg leading-tight">{o.headline}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between p-2.5 rounded-md bg-secondary/40">
                <span className="text-muted-foreground">Estrutura</span>
                <span className="font-medium">{o.structure}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-md bg-secondary/40">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium">{o.type}</span>
              </div>
              <div className="p-2.5 rounded-md bg-secondary/40">
                <div className="text-[11px] text-muted-foreground mb-1">Funil</div>
                <div className="font-mono text-xs">{o.funnel}</div>
              </div>
            </div>
            <button className="mt-4 w-full py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2">
              Usar como modelo <ExternalLink className="size-3.5" />
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}
