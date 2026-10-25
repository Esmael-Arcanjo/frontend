import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { api } from "@/lib/api";
import { SERVICES, SELECTABLE_ORDER } from "@/config/services";

export default function Plans() {
  const [pricing, setPricing] = useState({});
  useEffect(() => { api.get("/public/pricing").then((r) => setPricing(r.data)).catch(() => {}); }, []);
  const money = (c, cur) => new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: cur || "USD" }).format((c || 0) / 100);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">Planos</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Um único serviço por conta. Sem surpresa.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Pay-as-you-go em Payments e Marketplace. Planos mensais e anuais com <strong>7 dias grátis</strong>
            em Email, Automação e Link na Bio.
          </p>
        </div>
      </section>

      <section className="bg-background" data-testid="pricing-section">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SELECTABLE_ORDER.map((id, i) => {
              const s = SERVICES[id]; const p = pricing[id] || {};
              const isUsage = p.model === "usage";
              return (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                  data-testid={`pricing-card-${id}`}
                  className="flex flex-col rounded-3xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: s.accent }}>
                      <s.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold">{s.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                  <div className="my-5 border-t border-border" />
                  {isUsage ? (
                    <>
                      <p className="font-display text-3xl font-extrabold">Pay-as-you-go</p>
                      <p className="mt-1 text-xs text-muted-foreground">Fee aplicada por transação · sem plano fixo</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <p className="font-display text-3xl font-extrabold">{money(p.monthly, p.currency)}</p>
                        <span className="text-sm text-muted-foreground">/mês</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ou <strong>{money(p.yearly, p.currency)}</strong>/ano
                      </p>
                      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> 7 dias grátis</li>
                        <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> Cancele quando quiser</li>
                        <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> Cupom aceito</li>
                      </ul>
                    </>
                  )}
                  <div className="mt-auto pt-6">
                    <Button asChild className="w-full rounded-full">
                      <Link to="/register" data-testid={`pricing-cta-${id}`}>
                        Começar <ArrowRight className="ms-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
