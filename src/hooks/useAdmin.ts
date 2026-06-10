import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getAdminStats,
  getAllUsers,
  getAllOffers,
  getAllLeads,
  updateUserPlan,
  updateUserRole,
  deleteOfferAdmin,
  deleteLeadAdmin,
} from "@/lib/admin.functions";

export function useAdminStats() {
  const fetchStats = useServerFn(getAdminStats);
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => fetchStats(),
  });
}

export function useAllUsers() {
  const fetchUsers = useServerFn(getAllUsers);
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchUsers(),
  });
}

export function useAllOffers() {
  const fetchOffers = useServerFn(getAllOffers);
  return useQuery({
    queryKey: ["admin", "offers"],
    queryFn: () => fetchOffers(),
  });
}

export function useAllLeads() {
  const fetchLeads = useServerFn(getAllLeads);
  return useQuery({
    queryKey: ["admin", "leads"],
    queryFn: () => fetchLeads(),
  });
}

export function useUpdateUserPlan() {
  const mutation = useServerFn(updateUserPlan);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useUpdateUserRole() {
  const mutation = useServerFn(updateUserRole);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteOfferAdmin() {
  const mutation = useServerFn(deleteOfferAdmin);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "offers"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useDeleteLeadAdmin() {
  const mutation = useServerFn(deleteLeadAdmin);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
