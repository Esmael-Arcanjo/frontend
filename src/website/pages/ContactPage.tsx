import { PublicLayout } from "../layouts/PublicLayout";
import { SiteLeadForm } from "../components/SiteLeadForm";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr]" data-testid="contact-page">
        <div>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Entrar em contato</h1>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">Conte o que você precisa. Nossa equipe responde pelo WhatsApp informado.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8"><SiteLeadForm intent="contato" /></div>
      </div>
    </PublicLayout>
  );
}
