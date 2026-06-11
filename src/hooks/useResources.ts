import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useNiches() {
  return useQuery({
    queryKey: ["niches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("niches").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEbooks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ebooks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("ebooks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLandingPages() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["landing_pages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("landing_pages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreatives() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["creatives", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("creatives").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProducts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["products", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSaveProduct() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (vars: { offer_id?: string | null; platform: string; price: number; checkout_url?: string }) => {
      if (!user) throw new Error("Não autenticado");
      const { data, error } = await supabase.from("products").insert({
        user_id: user.id,
        offer_id: vars.offer_id ?? null,
        platform: vars.platform,
        price: vars.price,
        checkout_url: vars.checkout_url ?? null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function usePublishLanding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("landing_pages").update({ published: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing_pages"] }),
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard_stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [offers, leads, landings, ebooks, creatives, products] = await Promise.all([
        supabase.from("offers").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id, status", { count: "exact" }),
        supabase.from("landing_pages").select("id", { count: "exact", head: true }),
        supabase.from("ebooks").select("id", { count: "exact", head: true }),
        supabase.from("creatives").select("id", { count: "exact", head: true }),
        supabase.from("products").select("price"),
      ]);
      const totalRevenue = (products.data ?? []).reduce((s: number, p: any) => s + Number(p.price ?? 0), 0);
      const salesCount = (leads.data ?? []).filter((l: any) => l.status === "comprou").length;
      return {
        totalOffers: offers.count ?? 0,
        totalLandings: landings.count ?? 0,
        totalEbooks: ebooks.count ?? 0,
        totalCreatives: creatives.count ?? 0,
        totalLeads: leads.count ?? 0,
        salesCount,
        totalRevenue,
      };
    },
  });
}
