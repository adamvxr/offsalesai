import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Helper para carregar supabaseAdmin dentro do handler
async function getAdminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// Middleware helper: verifica se o usuário é admin
async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Acesso negado: apenas administradores");
}

// ---------- STATS ----------
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();

    const [users, offers, leads, credits] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin.from("offers").select("id", { count: "exact", head: true }),
      admin.from("leads").select("id", { count: "exact", head: true }),
      admin.from("profiles").select("credits"),
    ]);

    const totalCredits = (credits.data ?? []).reduce((s: number, r: any) => s + (r.credits ?? 0), 0);

    return {
      totalUsers: users.count ?? 0,
      totalOffers: offers.count ?? 0,
      totalLeads: leads.count ?? 0,
      totalCredits,
    };
  });

// ---------- ALL USERS ----------
export const getAllUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();

    const { data: profiles, error: pErr } = await admin
      .from("profiles")
      .select("id, display_name, avatar_url, plan, credits, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (pErr) throw pErr;

    const { data: roles, error: rErr } = await admin
      .from("user_roles")
      .select("user_id, role");

    if (rErr) throw rErr;

    const userMap = new Map<string, { roles: string[] }>();
    for (const r of roles ?? []) {
      const entry = userMap.get(r.user_id) ?? { roles: [] };
      entry.roles.push(r.role);
      userMap.set(r.user_id, entry);
    }

    return (profiles ?? []).map((p: any) => ({
      ...p,
      roles: userMap.get(p.id)?.roles ?? ["user"],
    }));
  });

// ---------- ALL OFFERS ----------
export const getAllOffers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();

    const { data, error } = await admin
      .from("offers")
      .select("id, user_id, title, niche, status, score, data, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

// ---------- ALL LEADS ----------
export const getAllLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();

    const { data, error } = await admin
      .from("leads")
      .select("id, user_id, offer_id, name, email, phone, status, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

// ---------- UPDATE USER PLAN / CREDITS ----------
const UpdatePlanInput = z.object({
  userId: z.string().uuid(),
  plan: z.string().min(1),
  credits: z.number().int().min(0),
});

export const updateUserPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpdatePlanInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();

    const { error } = await admin
      .from("profiles")
      .update({ plan: data.plan, credits: data.credits, updated_at: new Date().toISOString() })
      .eq("id", data.userId);

    if (error) throw error;
    return { ok: true };
  });

// ---------- UPDATE USER ROLE ----------
const UpdateRoleInput = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "moderator", "user"]),
  action: z.enum(["add", "remove"]),
});

export const updateUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpdateRoleInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();

    if (data.action === "add") {
      const { error } = await admin.from("user_roles").insert({ user_id: data.userId, role: data.role }).select();
      if (error && !error.message.includes("duplicate")) throw error;
    } else {
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw error;
    }
    return { ok: true };
  });

// ---------- DELETE OFFER ----------
const DeleteOfferInput = z.object({ offerId: z.string().uuid() });

export const deleteOfferAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DeleteOfferInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();
    const { error } = await admin.from("offers").delete().eq("id", data.offerId);
    if (error) throw error;
    return { ok: true };
  });

// ---------- DELETE LEAD ----------
const DeleteLeadInput = z.object({ leadId: z.string().uuid() });

export const deleteLeadAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DeleteLeadInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const admin = await getAdminClient();
    const { error } = await admin.from("leads").delete().eq("id", data.leadId);
    if (error) throw error;
    return { ok: true };
  });
