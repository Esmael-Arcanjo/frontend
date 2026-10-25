import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PublicHeader, PublicFooter } from "@/components/PublicHeader";

const CHANNELS = [
  { icon: Mail, label: "Comercial", value: "vendas@leamse.com", href: "mailto:vendas@leamse.com" },
  { icon: Mail, label: "Suporte técnico", value: "suporte@leamse.com", href: "mailto:suporte@leamse.com" },
  { icon: Phone, label: "WhatsApp", value: "(11) 4000-0000", href: "https://wa.me/551140000000" },
  { icon: MapPin, label: "São Paulo", value: "Av. Paulista, 1000 · 12º andar", href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Will be wired to Resend once the API key is pasted in backend/.env.
    setTimeout(() => {
      toast.success("Mensagem enviada! Vamos responder em até 1 dia útil.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">Contato</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Vamos conversar.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Dúvidas de produto, integração ou precisa de um plano personalizado?
            Nossa equipe responde em até 1 dia útil.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr,420px]">
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 sm:p-8" data-testid="contact-form">
            <h2 className="font-display text-xl font-bold">Envie uma mensagem</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                       data-testid="contact-name" />
              </div>
              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                       data-testid="contact-email" />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label>Assunto</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                     placeholder="Ex: Integração Marketplace API"
                     data-testid="contact-subject" />
            </div>
            <div className="mt-4 space-y-1.5">
              <Label>Mensagem</Label>
              <Textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Conte sobre o seu caso de uso — volume, serviços, prazos."
                        data-testid="contact-message" />
            </div>
            <Button type="submit" disabled={sending} className="mt-6 rounded-full" data-testid="contact-submit">
              {sending ? "Enviando…" : <>Enviar mensagem <Send className="ms-1 h-4 w-4" /></>}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Será entregue por Resend assim que suas chaves forem conectadas no backend.
            </p>
          </form>

          <aside className="space-y-4">
            {CHANNELS.map((c) => (
              <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="mt-0.5 block font-medium hover:text-primary">{c.value}</a>
                    ) : (
                      <p className="mt-0.5 font-medium">{c.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
