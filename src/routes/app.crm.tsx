import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLeads, useCreateLead, useUpdateLeadStatus, LEAD_STATUSES, type LeadStatusValue } from "@/hooks/useLeads";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/app/crm")({
  component: CRM,
});

const statusColor: Record<LeadStatusValue, string> = {
  "Novo Lead": "border-accent/40 text-accent",
  "Contatado": "border-primary/40 text-primary",
  "Em Conversa": "border-warning/40 text-warning",
  "Interessado": "border-chart-3/40 text-chart-3",
  "Comprou": "border-success/40 text-success",
  "Perdido": "border-destructive/40 text-destructive",
};

function CRM() {
  const { data: leads = [], isLoading } = useLeads();
  const create = useCreateLead();
  const update = useUpdateLeadStatus();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Mini CRM"
        description="Funil visual para acompanhar leads do primeiro contato até o fechamento."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-vibrant px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                <Plus className="size-4" /> Novo lead
              </button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader><DialogTitle>Novo lead</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Nome *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Telefone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Anotações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <Button
                  className="w-full bg-gradient-vibrant"
                  disabled={!form.name || create.isPending}
                  onClick={() => {
                    create.mutate(form, {
                      onSuccess: () => {
                        toast.success("Lead adicionado");
                        setForm({ name: "", email: "", phone: "", notes: "" });
                        setOpen(false);
                      },
                      onError: (e) => toast.error(e.message),
                    });
                  }}
                >
                  {create.isPending ? <Loader2 className="size-4 animate-spin" /> : "Adicionar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="grid place-items-center py-10"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
          {LEAD_STATUSES.map((s) => {
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
                      {l.email && <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{l.email}</div>}
                      {l.phone && <div className="text-[11px] text-muted-foreground truncate">{l.phone}</div>}
                      <select
                        value={l.status}
                        onChange={(e) => update.mutate({ id: l.id, status: e.target.value })}
                        className="mt-2 w-full text-[11px] bg-background/60 border border-border rounded px-1.5 py-1"
                      >
                        {LEAD_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
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
      )}
    </>
  );
}
