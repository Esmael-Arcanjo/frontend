import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Handshake, KeyRound, Layers, ServerCog, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "../layouts/PublicLayout";
import { fetchSegments, Segment } from "../services/catalog";

const STEPS = ["Escolha o produto", "Selecione seu segmento", "Escolha o plano", "Pague com segurança", "Acesse seu painel exclusivo"];
const VALUES = [
  { icon: Layers, title: "Contrate só o que usa", text: "Cada solução é independente, com assinatura, painel e endereço próprios. Nada de pacotes fechados." },
  { icon: Compass, title: "Feito para o seu mercado", text: "Campos, funis e fluxos são configurados de acordo com o segmento escolhido na contratação." },
  { icon: Handshake, title: "Simples de começar", text: "Cadastro em minutos, pagamento seguro e acesso imediato ao painel após a confirmação." },
];
const SECURITY = [
  { icon: ShieldCheck, title: "Isolamento por organização", text: "Cada requisição valida identidade, organização, permissão e assinatura no servidor." },
  { icon: KeyRound, title: "MFA e sessões revogáveis", text: "Argon2id, TOTP, cookies HttpOnly e encerramento remoto de sessões." },
  { icon: ServerCog, title: "Pagamento confirmado no servidor", text: "Checkout hospedado, webhooks assinados e idempotência. Nenhum cartão é armazenado." },
];

const Hero = () => (
  <section className="relative isolate overflow-hidden" data-testid="hero-section">
    <img src="/images/hero.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
    <div className="mx-auto w-full max-w-7xl px-4 py-24 text-white sm:px-6 lg:py-36">
      <h1 className="fade-up mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl" style={{ animationDelay: "80ms" }}>
        Tecnologia que trabalha <span className="text-accent">no ritmo da sua empresa.</span>
      </h1>
      <p className="fade-up mt-6 max-w-xl text-base text-white/80 md:text-lg" style={{ animationDelay: "160ms" }}>
        A LEAMSE desenvolve soluções digitais independentes para empresas e profissionais: você contrata apenas o que precisa e recebe tudo configurado para o seu mercado.
      </p>
      <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
        <Button asChild size="lg" className="rounded-full"><Link to="/empresas#sobre" data-testid="hero-cta-about">Conheça a Leamse <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
          <Link to="/precos" data-testid="hero-cta-pricing">Ver preços</Link>
        </Button>
      </div>
    </div>
  </section>
);

const CardGrid = ({ items }: { items: typeof VALUES }) => (
  <div className="mt-10 grid gap-5 md:grid-cols-3">
    {items.map((s) => (
      <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
        <s.icon className="h-6 w-6 text-primary" />
        <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
      </div>
    ))}
  </div>
);

export default function HomePage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  useEffect(() => { fetchSegments().then(setSegments).catch(() => setSegments([])); }, []);
  return (
    <PublicLayout>
      <Hero />
      <section id="sobre" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" data-testid="about-section">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Quem somos</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">Somos uma empresa de software que acredita em ferramentas simples, seguras e sob medida. Cada solução nasce separada, para que sua empresa cresça sem pagar pelo que não usa.</p>
        <CardGrid items={VALUES} />
      </section>
      <section id="segmentos" className="w-full border-y border-border bg-surface" data-testid="segments-section">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Como funciona</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">Da escolha ao painel em poucos passos, com tudo adaptado ao seu segmento.</p>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-foreground font-mono text-xs text-background">{i + 1}</span><span className="text-sm font-medium">{s}</span></li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {segments.map((s) => (
              <Link key={s.key} to={`/segmentos/${s.key}`} className="rounded-xl border border-border bg-card px-5 py-4 font-display font-bold transition-colors hover:border-primary" data-testid={`segment-${s.key}`}>{s.name}</Link>
            ))}
          </div>
        </div>
      </section>
      <section id="seguranca" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" data-testid="security-section">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Segurança desde a fundação</h2>
        <CardGrid items={SECURITY} />
      </section>
    </PublicLayout>
  );
}
