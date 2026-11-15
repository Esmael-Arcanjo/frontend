import { CreditCard, FileSearch, KeyRound, ShieldCheck } from "lucide-react";
import { NavDropdown } from "./NavDropdown";

export const SECURITY_TOPICS = [
  { id: "autenticacao", label: "Autenticação e MFA", hint: "Argon2id, TOTP e sessões revogáveis", icon: KeyRound },
  { id: "isolamento", label: "Isolamento de dados", hint: "Cada organização vê apenas os próprios dados", icon: ShieldCheck },
  { id: "pagamentos", label: "Pagamentos seguros", hint: "Checkout hospedado e confirmação no servidor", icon: CreditCard },
  { id: "privacidade", label: "Privacidade e auditoria", hint: "Registros de operações e retenção", icon: FileSearch },
];

const item = (t: (typeof SECURITY_TOPICS)[number]) => ({ ...t, to: `/seguranca#${t.id}` });

export const SecurityMenu = () => (
  <NavDropdown label="Segurança" testId="nav-security" columns={[
    [{ title: "Acesso e contas", items: SECURITY_TOPICS.slice(0, 2).map(item) }],
    [{ title: "Dados e pagamentos", items: SECURITY_TOPICS.slice(2).map(item) }],
  ]} />
);
