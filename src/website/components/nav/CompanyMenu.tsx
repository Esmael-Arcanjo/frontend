import { Building, Building2, Info, MessageCircle, UserRound } from "lucide-react";
import { NavDropdown } from "./NavDropdown";

export const COMPANY_TOPICS = [
  { id: "pequenas", label: "Pequenas empresas", hint: "Comece com um produto e um plano acessível", icon: Building },
  { id: "medias-grandes", label: "Médias e grandes empresas", hint: "Equipes, papéis e auditoria por produto", icon: Building2 },
  { id: "profissionais", label: "Profissionais autônomos", hint: "Link na Bio para pessoas e marcas pessoais", icon: UserRound },
  { id: "sobre", label: "Sobre a LEAMSE", hint: "Quem somos e como trabalhamos", icon: Info },
  { id: "contato", label: "Contato", hint: "Fale com nosso time", icon: MessageCircle },
];

const item = (t: (typeof COMPANY_TOPICS)[number]) => ({ ...t, to: `/empresas#${t.id}` });

export const CompanyMenu = () => (
  <NavDropdown label="Empresas" testId="nav-company" columns={[
    [{ title: "Para quem é", items: COMPANY_TOPICS.slice(0, 3).map(item) }],
    [{ title: "A LEAMSE", items: COMPANY_TOPICS.slice(3).map(item) }],
  ]} />
);
