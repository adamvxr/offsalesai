import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useAdminStats,
  useAllUsers,
  useAllOffers,
  useAllLeads,
  useUpdateUserPlan,
  useUpdateUserRole,
  useDeleteOfferAdmin,
  useDeleteLeadAdmin,
} from "@/hooks/useAdmin";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, Target, Layers, Wallet, ShieldCheck, UserCheck, UserX,
  Search, Trash2, CreditCard, Crown, Loader2, BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/app/admin")({
  component: AdminPage,
});

function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Área Administrativa"
        title="Painel do Admin"
        description="Controle completo de usuários, ofertas, leads e métricas do sistema."
      />
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2"><BarChart3 className="size-4" /> Visão Geral</TabsTrigger>
          <TabsTrigger value="users" className="gap-2"><Users className="size-4" /> Usuários</TabsTrigger>
          <TabsTrigger value="offers" className="gap-2"><Target className="size-4" /> Ofertas</TabsTrigger>
          <TabsTrigger value="leads" className="gap-2"><Layers className="size-4" /> Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="offers"><OffersTab /></TabsContent>
        <TabsContent value="leads"><LeadsTab /></TabsContent>
      </Tabs>
    </>
  );
}

// ─── Overview ───
function OverviewTab() {
  const { data: stats, isLoading } = useAdminStats();

  const cards = [
    { label: "Usuários", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-400" },
    { label: "Ofertas", value: stats?.totalOffers ?? 0, icon: Target, color: "text-emerald-400" },
    { label: "Leads", value: stats?.totalLeads ?? 0, icon: Layers, color: "text-amber-400" },
    { label: "Créditos totais", value: (stats?.totalCredits ?? 0).toLocaleString("pt-BR"), icon: Wallet, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bento p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-start justify-between">
              <div className="eyebrow">{c.label}</div>
              <c.icon className={cn("size-5", c.color)} />
            </div>
            <div className="font-display text-4xl tracking-tighter mt-2">
              {isLoading ? <Loader2 className="size-6 animate-spin" /> : c.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bento p-5">
          <div className="eyebrow mb-3">Distribuição de planos</div>
          <PlanDistribution />
        </div>
        <div className="bento p-5">
          <div className="eyebrow mb-3">Atividade recente</div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

function PlanDistribution() {
  const { data: users } = useAllUsers();
  const counts: Record<string, number> = {};
  (users ?? []).forEach((u: any) => { counts[u.plan] = (counts[u.plan] ?? 0) + 1; });
  const total = (users ?? []).length;
  const plans = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

  return (
    <div className="space-y-3">
      {total === 0 && <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado.</p>}
      {plans.map(([plan, count], i) => (
        <div key={plan} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="capitalize font-medium">{plan}</span>
            <span className="text-muted-foreground">{count} ({Math.round((count / total) * 100)}%)</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", colors[i % colors.length])} style={{ width: `${(count / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentActivity() {
  const { data: offers } = useAllOffers();
  const { data: leads } = useAllLeads();
  const recent = [
    ...(offers ?? []).slice(0, 5).map((o: any) => ({ type: "Oferta", name: o.title, date: o.created_at })),
    ...(leads ?? []).slice(0, 5).map((l: any) => ({ type: "Lead", name: l.name, date: l.created_at })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <div className="space-y-0">
      {recent.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>}
      {recent.map((item, i) => (
        <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 text-sm">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={item.type === "Oferta" ? "border-primary/40 text-primary" : "border-accent/40 text-accent"}>
              {item.type}
            </Badge>
            <span className="truncate max-w-[200px]">{item.name}</span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(item.date).toLocaleDateString("pt-BR")}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Users ───
function UsersTab() {
  const { data: users, isLoading } = useAllUsers();
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const updatePlan = useUpdateUserPlan();
  const updateRole = useUpdateUserRole();

  const filtered = (users ?? []).filter((u: any) =>
    (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Search className="size-4 text-muted-foreground absolute ml-3" />
        <Input
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 max-w-sm"
        />
      </div>

      <div className="bento overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest">Usuário</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Plano</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-right">Créditos</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Roles</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Criado</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="size-5 animate-spin mx-auto" /></TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</TableCell></TableRow>
            )}
            {filtered.map((u: any) => (
              <TableRow key={u.id} className="group">
                <TableCell>
                  <div className="font-medium">{u.display_name || "—"}</div>
                  <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}...</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{u.plan}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{u.credits.toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {u.roles.map((r: string) => (
                      <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="text-[10px] uppercase">
                        {r === "admin" && <ShieldCheck className="size-3 mr-1" />}
                        {r}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" onClick={() => setEditingUser(u)}>
                      <CreditCard className="size-4" />
                    </Button>
                    {u.roles.includes("admin") ? (
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateRole.mutate({ data: { userId: u.id, role: "admin", action: "remove" } })}>
                        <UserX className="size-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-primary" onClick={() => updateRole.mutate({ data: { userId: u.id, role: "admin", action: "add" } })}>
                        <UserCheck className="size-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} />
    </div>
  );
}

function EditUserDialog({ user, onClose }: { user: any; onClose: () => void }) {
  const updatePlan = useUpdateUserPlan();
  const [plan, setPlan] = useState(user?.plan ?? "free");
  const [credits, setCredits] = useState(user?.credits ?? 0);

  const open = !!user;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Editar usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Plano</label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["free", "starter", "pro", "agency"].map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Créditos</label>
            <Input type="number" value={credits} onChange={(e) => setCredits(Number(e.target.value))} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => {
              if (!user) return;
              updatePlan.mutate({ data: { userId: user.id, plan, credits } }, { onSuccess: onClose });
            }}
            disabled={updatePlan.isPending}
          >
            {updatePlan.isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Offers ───
function OffersTab() {
  const { data: offers, isLoading } = useAllOffers();
  const deleteOffer = useDeleteOfferAdmin();
  const [search, setSearch] = useState("");

  const filtered = (offers ?? []).filter((o: any) =>
    (o.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (o.niche ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Search className="size-4 text-muted-foreground absolute ml-3" />
        <Input placeholder="Buscar oferta..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 max-w-sm" />
      </div>
      <div className="bento overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest">Oferta</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Nicho</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-right">Score</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Criada</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="size-5 animate-spin mx-auto" /></TableCell></TableRow>}
            {!isLoading && filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma oferta.</TableCell></TableRow>}
            {filtered.map((o: any) => (
              <TableRow key={o.id} className="group">
                <TableCell>
                  <div className="font-medium truncate max-w-[200px]">{o.title}</div>
                  <div className="text-xs text-muted-foreground font-mono">{o.id.slice(0, 8)}...</div>
                </TableCell>
                <TableCell className="text-sm">{o.niche || "—"}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{o.status}</Badge></TableCell>
                <TableCell className="text-right tabular-nums">{o.score ?? 0}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteOffer.mutate({ data: { offerId: o.id } })}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Leads ───
function LeadsTab() {
  const { data: leads, isLoading } = useAllLeads();
  const deleteLead = useDeleteLeadAdmin();
  const [search, setSearch] = useState("");

  const filtered = (leads ?? []).filter((l: any) =>
    (l.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (l.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Search className="size-4 text-muted-foreground absolute ml-3" />
        <Input placeholder="Buscar lead..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 max-w-sm" />
      </div>
      <div className="bento overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest">Lead</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Contato</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Notas</TableHead>
              <TableHead className="text-xs uppercase tracking-widest">Criado</TableHead>
              <TableHead className="text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="size-5 animate-spin mx-auto" /></TableCell></TableRow>}
            {!isLoading && filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum lead.</TableCell></TableRow>}
            {filtered.map((l: any) => (
              <TableRow key={l.id} className="group">
                <TableCell>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{l.id.slice(0, 8)}...</div>
                </TableCell>
                <TableCell className="text-sm">
                  {l.email && <div>{l.email}</div>}
                  {l.phone && <div className="text-muted-foreground">{l.phone}</div>}
                </TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{l.status}</Badge></TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{l.notes || "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteLead.mutate({ data: { leadId: l.id } })}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
