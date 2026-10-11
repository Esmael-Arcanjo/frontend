import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/PublicHeader";

const HERO_IMAGE = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=70";

const BRAND_LOGOS = [
  // Public brand logos via commons / brand asset CDN — monochrome where possible.
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Shopify", src: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Shopify_logo_2018.svg" },
  { name: "Stripe", src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Mercado Livre", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mercadolibre.svg/320px-Mercadolibre.svg.png" },
  { name: "Nubank", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Logo_Nubank.svg/320px-Logo_Nubank.svg.png" },
];

const COMPANIES = [
  { name: "Ateliê Luma", role: "Moda autoral · 42 lojas", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=60",
    quote: "Centralizamos pagamentos, email e automação em uma plataforma só. O financeiro agradece." },
  { name: "Horta Verde", role: "Alimentos saudáveis · DTC", img: "https://images.unsplash.com/photo-1515942661900-94b3d1972591?auto=format&fit=crop&w=600&q=60",
    quote: "Em três semanas migramos 2 mil assinaturas. A taxa de churn caiu 18%." },
  { name: "Blume Beauty", role: "Marketplace · 300 vendedores", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=60",
    quote: "A API de split automático economiza horas de conciliação por semana." },
  { name: "Studio Kokō", role: "Design & papelaria", img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=60",
    quote: "O Link na Bio profissional dobrou nossa taxa de contato em uma semana." },
];

const STATS = [
  { v: "120M+", l: "Requisições por mês" },
  { v: "99.99%", l: "Uptime SLA" },
  { v: "R$ 2,1Bi", l: "Transacionados em 2025" },
  { v: "38", l: "Países atendidos" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* HERO full-width */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-20 text-white sm:px-6 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              Financial & Commerce Infrastructure · leamse.com
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-7xl">
              A infraestrutura <span className="text-primary">financeira e de comércio</span> das marcas que estão crescendo.
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
              Pagamentos, Marketplace, Email, Automação e Link na Bio em um só painel.
              Cada serviço com sua própria API e seu próprio painel isolado.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/register" data-testid="hero-cta">
                  Criar conta grátis <ArrowRight className="ms-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/planos" data-testid="hero-plans">Ver planos</Link>
              </Button>
            </div>
          </motion.div>

          <dl className="mt-6 grid grid-cols-2 gap-6 text-white md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <dt className="font-display text-2xl font-extrabold sm:text-3xl">{s.v}</dt>
                <dd className="mt-1 text-xs text-white/70">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Brand marquee */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Confiada por empresas e marcas em todo o Brasil
          </p>
          <div className="mt-6 grid grid-cols-3 items-center gap-x-10 gap-y-6 opacity-80 sm:grid-cols-6">
            {BRAND_LOGOS.map((b) => (
              <img key={b.name} src={b.src} alt={b.name} referrerPolicy="no-referrer"
                   data-testid={`brand-logo-${b.name.toLowerCase().replace(/\s+/g, "-")}`}
                   onError={(e) => { e.currentTarget.style.display = "none"; }}
                   className="mx-auto h-7 w-auto max-w-[120px] object-contain grayscale opacity-80 transition hover:opacity-100 hover:grayscale-0 sm:h-8"
                   loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* Advertising cards: empresas e marcas que usam */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Clientes LEAMSE
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Negócios reais rodando sobre a LEAMSE.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              De marketplaces a lojas DTC — veja como diferentes empresas usam cada serviço da nossa infraestrutura.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANIES.map((c, i) => (
              <motion.article
                key={c.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={c.img} alt={c.name}
                       className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-3 p-5">
                  <div>
                    <p className="font-display font-bold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                  <blockquote className="relative pl-4 text-sm leading-relaxed text-muted-foreground">
                    <Quote className="absolute left-0 top-0 h-3.5 w-3.5 text-primary" />
                    {c.quote}
                  </blockquote>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Big advertising banner */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=70"
               alt="" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              A plataforma que escala com a sua marca.
            </h2>
            <p className="mt-5 max-w-xl text-white/80 md:text-lg">
              Sem gateways externos, sem lock-in e sem taxa escondida. Comece grátis e ligue cada
              serviço quando você estiver pronto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/register" data-testid="banner-cta">Começar agora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/contato">Falar com vendas</Link>
              </Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-4 text-sm">
            {["Pagamentos próprios · sem gateway",
              "Marketplace com split automático",
              "Email transacional ilimitado",
              "Automação + CRM + WhatsApp AI",
              "Link na Bio incluído em toda conta",
              "APIs REST com cada chave isolada"].map((f) => (
              <li key={f} className="rounded-2xl bg-white/10 p-5 backdrop-blur">{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}