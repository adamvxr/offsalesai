import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CreditCard, ChevronRight, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts, useSaveProduct } from "@/hooks/useResources";
import { useOffers } from "@/hooks/useOffers";
import { toast } from "sonner";

export const Route = createFileRoute("/app/checkout")({
  component: Checkout,
});

const platforms = ["Hotmart", "Kiwify", "Eduzz", "Perfect Pay", "Monetizze"];

function Checkout() {
  const [platform, setPlatform] = useState("Kiwify");
  const [price, setPrice] = useState("97");
  const [url, setUrl] = useState("");
  const [offerId, setOfferId] = useState<string>("");
  const { data: offers = [] } = useOffers();
  const { data: products = [] } = useProducts();
  const save = useSaveProduct();

  const handleSave = async () => {
    try {
      await save.mutateAsync({
        offer_id: offerId || null,
        platform,
        price: Number(price),
        checkout_url: url,
      });
      toast.success("Checkout salvo");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Passo 4 de 8"
        title="Checkout & Monetização"
        description="Configure plataforma, preço e URL do checkout."
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Plataforma</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "p-4 rounded-xl border transition text-sm font-semibold",
                    platform === p ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-secondary/40 hover:border-primary/40",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          <Card className="glass border-border/60 p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Dados do produto</div>
            <div className="grid gap-4">
              <div>
                <Label className="text-xs mb-1.5 block">Vincular oferta</Label>
                <select
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm"
                >
                  <option value="">— Nenhuma —</option>
                  {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Preço (R$)</Label>
                  <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">URL do checkout</Label>
                  <Input placeholder="https://pay.kiwify.com.br/..." value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={save.isPending}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
              >
                {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Salvar
              </button>
            </div>
          </Card>

          {products.length > 0 && (
            <Card className="glass border-border/60 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Produtos cadastrados</div>
              <div className="space-y-2">
                {products.map((p: any) => (
                  <div key={p.id} className="p-3 rounded-lg bg-secondary/40 border border-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{p.platform} · R$ {Number(p.price).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground font-mono line-clamp-1">{p.checkout_url || "(sem URL)"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="glass border-border/60 p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-60" />
            <div className="relative">
              <CreditCard className="size-5 text-accent mb-3" />
              <div className="font-display font-bold text-xl">Plataforma selecionada</div>
              <div className="text-sm text-muted-foreground mt-1">{platform}</div>
              <div className="mt-4 p-3 rounded-lg bg-secondary/60 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Preço</span><span className="font-semibold">R$ {Number(price || 0).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">URL</span><span className="font-mono truncate max-w-[140px]">{url || "—"}</span></div>
              </div>
            </div>
          </Card>
          <Link to="/app/landing" className="block text-center w-full px-5 py-4 rounded-xl bg-gradient-vibrant text-primary-foreground font-semibold shadow-glow">
            Gerar Landing Page <ChevronRight className="size-4 inline-block" />
          </Link>
        </div>
      </div>
    </>
  );
}
