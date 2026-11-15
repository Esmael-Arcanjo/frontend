import { InfoPageLayout } from "../layouts/InfoPageLayout";

const SECTIONS = [
  { id: "pequenas", label: "Pequenas empresas", body: [
    "Contrate apenas o produto que você precisa hoje, com planos mensais ou anuais e sem fidelidade.",
    "Cada produto tem painel próprio e é configurado para o seu segmento de mercado." ] },
  { id: "medias-grandes", label: "Médias e grandes empresas", body: [
    "Convide equipes com papéis (proprietário, administrador, membro e leitor) definidos por produto.",
    "Ações administrativas exigem MFA e ficam registradas no histórico auditável." ] },
  { id: "profissionais", label: "Profissionais autônomos", body: [
    "O Link na Bio permite criar uma página profissional como pessoa ou como empresa, com foto, redes sociais e localização." ] },
  { id: "sobre", label: "Sobre a LEAMSE", body: [
    "A LEAMSE desenvolve produtos SaaS independentes, cada um com assinatura, endereço e painel próprios." ] },
  { id: "contato", label: "Contato", body: [
    "Fale com o nosso time pelo e-mail suporte@leamse.com." ] },
];

export default function CompanyPage() {
  return <InfoPageLayout title="Para empresas" subtitle="Soluções para negócios de todos os tamanhos e profissionais." sections={SECTIONS} testId="company-page" />;
}
