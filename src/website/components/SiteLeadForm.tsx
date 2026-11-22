import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/shared/api/client";
import { SiteIntent, submitSiteLead } from "../services/leads";

const COPY: Record<SiteIntent, { wants: string; price: string; cta: string }> = {
  anunciar: { wants: "O que você quer anunciar?", price: "Preço", cta: "Enviar anúncio" },
  comprar: { wants: "O que você procura?", price: "Quanto quer pagar?", cta: "Quero comprar" },
  contato: { wants: "Mensagem", price: "", cta: "Enviar mensagem" },
};

export const SiteLeadForm = ({ intent, initialWants = "", onDone }: { intent: SiteIntent; initialWants?: string; onDone?: () => void }) => {
  const [form, setForm] = useState({ name: "", whatsapp: "", city: "", wants: initialWants, price: "", website: "" });
  const [busy, setBusy] = useState(false);
  const c = COPY[intent];
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitSiteLead({ ...form, intent });
      toast.success("Recebemos! Vamos falar com você pelo WhatsApp.");
      setForm({ name: "", whatsapp: "", city: "", wants: "", price: "", website: "" });
      onDone?.();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4" data-testid={`site-lead-form-${intent}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor={`sl-name-${intent}`}>Nome</Label><Input id={`sl-name-${intent}`} required minLength={2} value={form.name} onChange={set("name")} data-testid="site-lead-name" /></div>
        <div className="space-y-2"><Label htmlFor={`sl-wa-${intent}`}>WhatsApp com DDD</Label><Input id={`sl-wa-${intent}`} required inputMode="tel" placeholder="(11) 99999-0000" value={form.whatsapp} onChange={set("whatsapp")} data-testid="site-lead-whatsapp" /></div>
        <div className="space-y-2"><Label htmlFor={`sl-city-${intent}`}>Cidade</Label><Input id={`sl-city-${intent}`} value={form.city} onChange={set("city")} data-testid="site-lead-city" /></div>
        {c.price && <div className="space-y-2"><Label htmlFor={`sl-price-${intent}`}>{c.price}</Label><Input id={`sl-price-${intent}`} placeholder="R$ 0,00" value={form.price} onChange={set("price")} data-testid="site-lead-price" /></div>}
      </div>
      <div className="space-y-2"><Label htmlFor={`sl-wants-${intent}`}>{c.wants}</Label><Textarea id={`sl-wants-${intent}`} required rows={3} value={form.wants} onChange={set("wants")} data-testid="site-lead-wants" /></div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={form.website} onChange={set("website")} />
      <Button type="submit" disabled={busy} className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90" data-testid="site-lead-submit">{busy ? "Enviando..." : c.cta}</Button>
    </form>
  );
};
