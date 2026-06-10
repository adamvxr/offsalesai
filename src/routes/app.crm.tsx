import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { leads, leadStatuses, type LeadStatus } from "@/lib/mock-data";
import { Plus, MessageCircle, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/app/crm")({
  component: CRM,
});

const statusColor: Record<LeadStatus, string> = {
  "Novo Lead": "border-accent/40 text-accent",
  "Contatado": "border-primary/40 text-primary",
  "Em Conversa": "border-warning/40 text-warning",
  "Interessado": "border-chart-3/40 text-chart-3",
  "Comprou": "border-success/40 text-success",
  "Perdido": "border-destructive/40 text-destructive",
};

function CRM() {
  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Mini CRM"
        description="Funil visual para acompanhar leads do primeiro contato até o fechamento."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-4" /> Novo lead
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {leadStatuses.map((s) => {
          const list = leads.filter((l) => l.status === s);
          return (
            <Card key={s} className="glass border-border/60 p-3 min-w-[220px]">
              <div className="flex items-center justify-between mb-3">
                <div className="font-display font-semibold text-sm">{s}</div>
                <Badge variant="outline" className={statusColor[s]}>{list.length}</Badge>
              </div>
              <div className="space-y-2">
                {list.map((l) => (
                  <div key={l.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="font-semibold text-sm">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{l.offer}</div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Phone className="size-3" /></span>
                      <span className="inline-flex items-center gap-1"><Mail className="size-3" /></span>
                      <span className="inline-flex items-center gap-1"><MessageCircle className="size-3" /></span>
                      <span className="ml-auto">{l.origin}</span>
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <div className="p-3 rounded-lg border border-dashed border-border text-[11px] text-muted-foreground text-center">
                    Vazio
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
