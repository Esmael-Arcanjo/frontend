import { Link } from "react-router-dom";
import { Target, Globe2, Rocket, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/PublicHeader";

const VALUES = [
  { icon: Target, title: "Produto antes de hype", desc: "Lançamos quando algo funciona de verdade, com documentação e SLA sério." },
  { icon: Globe2, title: "Operação regional", desc: "Infra em São Paulo, com planos de redundância multi-região em 2026." },
  { icon: Rocket, title: "Builders no DNA", desc: "Trabalhamos como um squad enxuto, com decisões rápidas e código aberto onde dá." },
  { icon: HeartHandshake, title: "Clientes como parceiros", desc: "Entendemos a dor do negócio real — resposta direta, sem robô." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="relative isolate overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=70"
               alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">Sobre nós</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Construindo a próxima infraestrutura<br className="hidden lg:block" /> financeira e de comércio do Brasil.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Nascemos para simplificar como negócios recebem, enviam, se comunicam e crescem online —
            sem intermediários, sem lock-in, sem taxas escondidas.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70"
               alt="" className="rounded-3xl object-cover shadow-xl" />
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Nossa missão</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Dar a qualquer negócio — do pequeno vendedor de bairro à marca com milhares de pedidos
              por dia — a mesma qualidade de infraestrutura usada por bancos digitais e grandes
              marketplaces.
            </p>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Um ecossistema modular com cinco serviços, cada um com seu painel isolado, sua API
              independente e cobrança separada.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Nossos valores</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-3xl border border-border bg-background p-6">
                <span className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Pronto para começar?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Criar sua conta é grátis. Você só paga pelo serviço que ligar — e cancela quando quiser.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/register" data-testid="about-cta">Criar conta grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
