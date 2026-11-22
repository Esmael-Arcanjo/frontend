import { useMemo } from "react";
import { productApi } from "@/shared/api/client";
import { useCrmContext } from "../hooks/useCrmContext";

const BASE = "/api/v1/crm";

export const crmClient = (orgId: string) => {
  const http = productApi(orgId);
  return {
    overview: async () => (await http.get(`${BASE}/overview`)).data,
    segmentConfig: async () => (await http.get(`${BASE}/segment-config`)).data,
    list: async <T,>(resource: string, params?: Record<string, unknown>): Promise<T[]> => (await http.get(`${BASE}/${resource}`, { params })).data.items,
    create: async <T,>(resource: string, body: unknown): Promise<T> => (await http.post(`${BASE}/${resource}`, body)).data,
    update: async <T,>(resource: string, id: string, body: unknown): Promise<T> => (await http.put(`${BASE}/${resource}/${id}`, body)).data,
    remove: async (resource: string, id: string) => { await http.delete(`${BASE}/${resource}/${id}`); },
    convertLead: async (id: string) => (await http.post(`${BASE}/leads/${id}/convert`)).data,
    moveStage: async (id: string, stage_key: string, version: number) => (await http.patch(`${BASE}/opportunities/${id}/stage`, { stage_key, version })).data,
    pipeline: async () => (await http.get(`${BASE}/pipeline`)).data,
    savePipeline: async (body: unknown) => (await http.put(`${BASE}/pipeline`, body)).data,
    members: async () => (await http.get("/api/v1/organizations/crm/members")).data,
    invite: async (email: string, role: string) => (await http.post("/api/v1/organizations/crm/invites", { email, role })).data,
    cancelInvite: async (id: string) => (await http.delete(`/api/v1/organizations/crm/invites/${id}`)).data,
    changeRole: async (userId: string, role: string) => (await http.patch(`/api/v1/organizations/crm/members/${userId}`, { role })).data,
    removeMember: async (userId: string) => (await http.delete(`/api/v1/organizations/crm/members/${userId}`)).data,
    subscription: async () => (await http.get("/api/v1/billing/crm/subscription")).data,
    whatsapp: async () => (await http.get(`${BASE}/integrations/whatsapp`)).data,
    saveWhatsapp: async (body: unknown) => (await http.put(`${BASE}/integrations/whatsapp`, body)).data,
    connectWhatsapp: async () => (await http.post(`${BASE}/integrations/whatsapp/connect`)).data,
    whatsappStatus: async () => (await http.get(`${BASE}/integrations/whatsapp/status`)).data,
    disconnectWhatsapp: async () => (await http.post(`${BASE}/integrations/whatsapp/disconnect`)).data,
    site: async () => (await http.get(`${BASE}/integrations/site`)).data,
    rotateSiteToken: async () => (await http.post(`${BASE}/integrations/site/token`)).data,
    conversations: async () => (await http.get(`${BASE}/conversations`)).data.items,
    conversation: async (id: string) => (await http.get(`${BASE}/conversations/${id}`)).data,
    sendMessage: async (id: string, text: string) => (await http.post(`${BASE}/conversations/${id}/send`, { text })).data,
    publishLead: async (id: string, published: boolean) => (await http.patch(`${BASE}/leads/${id}/publish`, { published })).data,
    notifications: async () => (await http.get("/api/v1/users/me/notifications", { params: { product_key: "crm" } })).data.notifications,
    readNotification: async (id: string) => (await http.post(`/api/v1/users/me/notifications/${id}/read`)).data,
    cancel: async () => (await http.post("/api/v1/billing/crm/cancel")).data,
    resume: async () => (await http.post("/api/v1/billing/crm/resume")).data,
    audit: async () => (await http.get("/api/v1/audit/crm")).data.events,
  };
};

export type CrmClient = ReturnType<typeof crmClient>;

export const useCrmApi = (): CrmClient => {
  const { organization_id } = useCrmContext();
  return useMemo(() => crmClient(organization_id), [organization_id]);
};
