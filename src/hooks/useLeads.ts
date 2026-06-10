import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type LeadRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  notes: string | null;
  offer_id: string | null;
  created_at: string;
};

export const LEAD_STATUSES = ["Novo Lead", "Contatado", "Em Conversa", "Interessado", "Comprou", "Perdido"] as const;
export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export function useLeads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["leads", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<LeadRow[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LeadRow[];
    },
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { name: string; email?: string; phone?: string; status?: string; notes?: string }) => {
      if (!user) throw new Error("not authenticated");
      const { error } = await supabase.from("leads").insert({
        user_id: user.id,
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        notes: input.notes || null,
        status: input.status ?? "Novo Lead",
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}
