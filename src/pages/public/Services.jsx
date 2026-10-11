import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { SERVICES, SELECTABLE_ORDER } from "@/config/services";

const DETAILS = {
  payments: ["Payment Intents, autorização e captura separadas",
             "Split automático entre múltiplos vendedores (bps)",
             "Carteira e ledger duplo com saldo em tempo real",
             "Webhooks assinados · idempotência · reembolsos"],
  marketplace: ["Vendedores, produtos, pedidos e comissões",
                "Split automático integrado ao Payments",
                "Páginas públicas de loja com URL própria",
                "Reviews, chat buyer↔seller e inbox"],
  email: ["Templates HTML com variáveis dinâmicas",
          "Entrega em sandbox e produção",
          "Histórico, bounces e estatísticas por campanha",
          "Chaves isoladas por projeto · rate limit"],
  automation: ["Agenda com janelas e disponibilidade",
               "CRM visual (kanban) · follow-ups automáticos",
               "Assistente WhatsApp 24/7 com IA",
               "Fluxos cross-services (lead → email → pedido)"],
  linkbio: ["Página pública profissional pronta",
            "Foto de perfil, capa, cor de destaque",
            "Analytics de visitas e cliques por link",
            "Domínio próprio opcional (CNAME)"],
};

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">Serviços</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Cinco serviços, uma única infraestrutura.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Cada serviço com sua própria API, seu painel isolado e seu modelo de cobrança.
            Ligue apenas o que você precisa — comece com um, escale para todos.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 sm:px-6">
          {SELECTABLE_ORDER.map((id) => {
            const s = SERVICES[id];
            return (
              <article key={id} data-testid={`service-${id}`}
                       className="grid gap-6 overflow-hidden rounded-3xl border border-border bg-card p-6 lg:grid-cols-[200px,1fr,220px] lg:items-center lg:gap-10 lg:p-8">
                <div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                        style={{ backgroundColor: s.accent }}>
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 font-display text-xl font-extrabold sm:text-2xl">{s.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {(DETAILS[id] || []).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <Button asChild className="rounded-full">
                    <Link to="/register" data-testid={`service-cta-${id}`}>Começar com {s.name} <ArrowRight className="ms-1 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/planos">Ver plano</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
