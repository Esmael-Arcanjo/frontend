import { productApi } from "@/shared/api/client";

const B = "/api/v1/link_bio";

export const bioClient = (orgId: string) => {
  const http = productApi(orgId);
  return {
    meta: async () => (await http.get(`${B}/meta`)).data,
    overview: async () => (await http.get(`${B}/overview`)).data,
    page: async () => (await http.get(`${B}/page`)).data,
    saveProfile: async (body: unknown) => (await http.put(`${B}/page`, body)).data,
    saveHandle: async (handle: string) => (await http.put(`${B}/page/handle`, { handle })).data,
    publish: async (published: boolean) => (await http.put(`${B}/page/publish`, { published })).data,
    setAvatar: async (data_url: string) => (await http.put(`${B}/page/avatar`, { data_url })).data,
    removeAvatar: async () => (await http.delete(`${B}/page/avatar`)).data,
    links: async () => (await http.get(`${B}/links`)).data.items,
    createLink: async (body: unknown) => (await http.post(`${B}/links`, body)).data,
    updateLink: async (id: string, body: unknown) => (await http.put(`${B}/links/${id}`, body)).data,
    deleteLink: async (id: string) => { await http.delete(`${B}/links/${id}`); },
    reorder: async (ids: string[]) => (await http.put(`${B}/links/reorder`, { ids })).data,
    theme: async () => (await http.get(`${B}/theme`)).data,
    saveTheme: async (body: unknown) => (await http.put(`${B}/theme`, body)).data,
    analytics: async (days: number) => (await http.get(`${B}/analytics`, { params: { days } })).data,
    subscription: async () => (await http.get("/api/v1/billing/link_bio/subscription")).data,
    cancel: async () => (await http.post("/api/v1/billing/link_bio/cancel")).data,
    resume: async () => (await http.post("/api/v1/billing/link_bio/resume")).data,
  };
};
