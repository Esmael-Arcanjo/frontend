import { api } from "@/shared/api/client";

const B = "/api/v1/admin";
export type Stats = { users: number; organizations: number; active_subscriptions: number; paid_subscriptions: number; free_subscriptions: number; mrr_cents: number; revenue_total: number; expiring_7_days: number; by_product: Record<string, number> };
export type AdminUser = { id: string; name: string; email: string; document: string | null; email_verified: boolean; is_admin: boolean; created_at: string | null; products: { product_key: string; plan_key: string; status: string }[] };
export type AdminSub = { id: string; organization: string | null; owner_email: string | null; product_key: string; plan_key: string; status: string; price_cents: number; billing_method: string; current_period_end: number | null; days_left: number | null; cancel_at_period_end: boolean };
export type Revenue = { months: { month: string; total: number; count: number }[]; recent: { id: string; product_key: string; amount: number; currency: string; email: string | null; created_at: string }[] };

export const adminApi = {
  stats: async (): Promise<Stats> => (await api.get(`${B}/stats`)).data,
  users: async (q?: string): Promise<AdminUser[]> => (await api.get(`${B}/users`, { params: { q: q || undefined } })).data.items,
  deleteUser: async (id: string) => (await api.delete(`${B}/users/${id}`)).data,
  subscriptions: async (): Promise<AdminSub[]> => (await api.get(`${B}/subscriptions`)).data.items,
  grant: async (body: { email: string; product_key: string; days: number }) => (await api.post(`${B}/grant-free`, body)).data,
  revenue: async (): Promise<Revenue> => (await api.get(`${B}/revenue`)).data,
};

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dateOf = (epoch: number | null) => (epoch ? new Date(epoch * 1000).toLocaleDateString("pt-BR") : "—");
