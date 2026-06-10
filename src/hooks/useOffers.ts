import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type OfferRow = {
  id: string;
  title: string;
  niche: string | null;
  status: string;
  score: number | null;
  data: Record<string, unknown>;
  created_at: string;
};

export function useOffers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["offers", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OfferRow[]> => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OfferRow[];
    },
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offers"] }),
  });
}
