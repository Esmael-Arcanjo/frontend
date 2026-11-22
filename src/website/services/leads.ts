import { api } from "@/shared/api/client";

export type SiteIntent = "anunciar" | "comprar" | "contato";
export type SiteLeadPayload = { name: string; whatsapp: string; city?: string; intent: SiteIntent; wants?: string; price?: string; website?: string };
export type Listing = { id: string; title: string; city: string | null; price: string | null; created_at: string };

export const submitSiteLead = async (payload: SiteLeadPayload) => (await api.post("/api/leads", payload)).data;
export const fetchListings = async (): Promise<Listing[]> => (await api.get("/api/v1/public/listings")).data.items;
