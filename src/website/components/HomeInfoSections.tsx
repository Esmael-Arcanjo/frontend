import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, Code2, Compass, CreditCard, Handshake, KeyRound, Layers, Megaphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchSegments, Segment } from "../services/catalog";

const AREAS = [
  { icon: Megaphone, title: "Vendas e presença digital", text: "Página de links, CRM com WhatsApp, marketing e atendimento automático para atrair e converter clientes." },
  { icon: Boxes, title: "Gestão da empresa", text: "Estoque, financeiro, equipe, recebimentos e assinatura de documentos em painéis separados." },
  { icon: Code2, title: "APIs para desenvolvedores", text: "E-mail transacional, pagamentos e marketplace para integrar ao seu próprio sistema." },
];
const VALUES = [
  { icon: Layers, title: "Contrate só o que usa", text: "Cada solução tem assinatura, painel e endereço próprios. Nada de pacotes fechados." },
  { icon: Compass, title: "Feito para o seu mercado", text: "Campos, funis e fluxos configurados pelo segmento escolhido na contratação." },
  { icon: Handshake, title: "Simples de começar", text: "Cadastro em minutos, pagamento por cartão ou Pix e acesso imediato ao painel." },
];
const SECURITY = [
  { icon: ShieldCheck, title: "Dados isolados", text: "Cada organização acessa apenas os próprios dados, validados no servidor." },
  { icon: KeyRound, title: "Contas protegidas", text: "Senhas com Argon2id, verificação em dois fatores e sessões revogáveis." },
  { icon: CreditCard, title: "Pagamento seguro", text: "Checkout da Stripe, confirmação no servidor e nenhum cartão armazenado." },
];
const STEPS = ["Escolha a solução", "Selecione seu segmento", "Escolha o plano", "Pague com cartão ou Pix", "Acesse seu painel"];

type Item = { icon: typeof Layers; title: string; text: string };
const Grid = ({ items, testId }: { items: Item[]; testId: string }) => (
  <div className="mt-10 grid gap-5 md:grid-cols-3" data-testid={testId}>
    {items.map((s) => (
      <div key={s.title} className="rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1">
        <s.icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
        <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
      </div>
    ))}
  </div>
);

const Heading = ({ kicker, title, text }: { kicker: string; title: string; text?: string }) => (
  <div className="max-w-2xl">
    <p className="text-xs font-bold uppercase tracking-widest text-accent">{kicker}</p>
    <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{title}</h2>
    {text && <p className="mt-3 text-sm text-muted-foreground md:text-base">{text}</p>}
  </div>
);

export const InfoSections = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  useEffect(() => { fetchSegments().then(setSegments).catch(() => setSegments([])); }, []);
  return (
    <>
      <section className="w-full bg-surface" data-testid="home-areas">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <Heading kicker="Plataforma LEAMSE" title="Soluções para cada área do seu negócio" text="Tudo que sua empresa precisa para vender, gerir e integrar, em ferramentas independentes." />
          <Grid items={AREAS} testId="home-areas-grid" />
          <Button asChild className="mt-8 rounded-full"><Link to="/precos" data-testid="home-areas-pricing">Ver planos e preços <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" data-testid="home-values">
        <Heading kicker="Por que a LEAMSE" title="Tecnologia no ritmo da sua empresa" />
        <Grid items={VALUES} testId="home-values-grid" />
      </section>
      <section className="w-full bg-[#5b21b6] text-white" data-testid="home-how">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Como funciona</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Da escolha ao painel em poucos passos</h2>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => <li key={s} className="flex items-center gap-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary font-mono text-xs text-secondary-foreground">{i + 1}</span><span className="text-sm font-medium">{s}</span></li>)}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center" data-testid="home-segments">
            {segments.map((s) => <Link key={s.key} to={`/segmentos/${s.key}`} className="rounded-xl bg-white/10 px-5 py-4 font-display font-bold transition-colors hover:bg-white/20" data-testid={`home-segment-${s.key}`}>{s.name}</Link>)}
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" data-testid="home-security">
        <Heading kicker="Segurança" title="Protegido desde a fundação" text="Boas práticas aplicadas a todos os produtos, do login ao pagamento." />
        <Grid items={SECURITY} testId="home-security-grid" />
        <Button asChild variant="outline" className="mt-8 rounded-full"><Link to="/seguranca" data-testid="home-security-more">Saiba mais sobre segurança</Link></Button>
      </section>
    </>
  );
};
