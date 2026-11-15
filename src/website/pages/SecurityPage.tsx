import { InfoPageLayout } from "../layouts/InfoPageLayout";

const SECTIONS = [
  { id: "autenticacao", label: "Autenticação e MFA", body: [
    "Senhas protegidas com Argon2id, bloqueio após tentativas inválidas e autenticação em dois fatores (TOTP).",
    "Sessões com tokens de curta duração, renovação controlada e encerramento remoto em Sessões Ativas." ] },
  { id: "isolamento", label: "Isolamento de dados", body: [
    "Cada requisição valida identidade, organização, permissão do produto e assinatura diretamente no servidor.",
    "Os dados de uma organização nunca são acessíveis por outra; tentativas retornam “não encontrado”." ] },
  { id: "pagamentos", label: "Pagamentos seguros", body: [
    "Pagamentos processados em checkout hospedado pela Stripe. Não armazenamos dados de cartão.",
    "A assinatura só é ativada após confirmação do pagamento entre servidores, com webhooks assinados e idempotentes." ] },
  { id: "privacidade", label: "Privacidade e auditoria", body: [
    "Operações críticas ficam registradas no histórico de cada produto, com retenção definida.",
    "Logs não armazenam senhas, tokens ou dados completos de cartão." ] },
];

export default function SecurityPage() {
  return <InfoPageLayout title="Segurança" subtitle="Segurança aplicada desde a fundação em todos os produtos LEAMSE." sections={SECTIONS} testId="security-page" />;
}
