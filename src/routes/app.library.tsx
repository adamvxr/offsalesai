import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { winningOffers } from "@/lib/mock-data";
import { Bookmark, ExternalLink, Trash2, Loader2, Plus } from "lucide-react";
import { useOffers, useDeleteOffer } from "@/hooks/useOffers";
import { toast } from "sonner";

export const Route = createFileRoute("/app/library")({
  component: Library,
});

function Library() {
  const { data: myOffers, isLoading } = useOffers();
  const del = useDeleteOffer();

  return (
    <>
      <PageHeader
        eyebrow="Suas Ofertas"
        title="Biblioteca"
        description="Suas ofertas geradas pela IA + estudos de caso reais por nicho."
        actions={
          <Link to="/app/validation" className="inline-flex items-center gap-2 rounded-lg bg-gradient-vibrant px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-4" /> Nova oferta
          </Link>
        }
      />

      <section className="mb-10">
        <div className="eyebrow mb-3">Minhas ofertas</div>
        {isLoading ? (
          <div className="grid place-items-center py-10"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : !myOffers || myOffers.length === 0 ? (
          <Card className="glass border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Você ainda não criou ofertas. <Link to="/app/validation" className="text-primary font-semibold underline">Comece agora →</Link>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myOffers.map((o) => {
              const d = o.data as { headline?: string; bigIdea?: string; promise?: string };
              return (
                <Card key={o.id} className="glass border-border/60 p-5 hover:border-primary/40 transition group">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-primary/15 text-primary border border-primary/30">{o.niche ?? "—"}</Badge>
                    <button
                      onClick={() => {
                        if (confirm("Apagar esta oferta?")) {
                          del.mutate(o.id, { onSuccess: () => toast.success("Oferta apagada") });
                        }
                      }}
                      className="size-8 rounded-md glass grid place-items-center opacity-60 hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-lg leading-tight">{o.title}</h3>
                  {d.headline && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{d.headline}</p>}
                  <div className="mt-4 text-[11px] text-muted-foreground">
                    Criada em {new Date(o.created_at).toLocaleDateString("pt-BR")}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="eyebrow mb-3">Ofertas vencedoras (inspiração)</div>
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
              <Link to="/app/validation" className="mt-4 w-full py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2">
                Usar como modelo <ExternalLink className="size-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
