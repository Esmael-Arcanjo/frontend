import { useParams } from "react-router-dom";
import { InfoPageLayout } from "../layouts/InfoPageLayout";

const SECTIONS = [
  { id: "dados", label: "Dados que utilizamos", body: [
    "Podemos tratar dados fornecidos no cadastro e no uso dos serviços, como nome, e-mail, CPF ou CNPJ, informações de perfil e conteúdo inserido pelo usuário.",
    "Também podemos tratar dados técnicos e registros de uso necessários para operar, proteger e dar suporte à plataforma. Dados de pagamento podem ser tratados por provedores de pagamento; não informe dados de cartão fora dos ambientes indicados para esse fim."
  ] },
  { id: "finalidades", label: "Como usamos os dados", body: [
    "Utilizamos os dados para criar e administrar contas, fornecer os produtos contratados, processar solicitações e pagamentos, prestar suporte, proteger os serviços contra fraude e cumprir obrigações legais.",
    "O tratamento ocorre conforme a legislação aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD), com base legal adequada a cada finalidade."
  ] },
  { id: "compartilhamento", label: "Compartilhamento", body: [
    "Os dados podem ser compartilhados com fornecedores que apoiam a hospedagem, operação, suporte e processamento de pagamentos, limitados ao necessário para executar esses serviços.",
    "Também poderemos compartilhar dados quando exigido por lei ou necessário para proteger direitos, usuários e a segurança da plataforma. Não vendemos dados pessoais."
  ] },
  { id: "retencao", label: "Armazenamento e segurança", body: [
    "Mantemos os dados pelo período necessário para as finalidades informadas, para cumprir obrigações legais e resolver questões relacionadas aos serviços. Depois, eles poderão ser eliminados ou anonimizados quando permitido.",
    "Adotamos medidas técnicas e organizacionais para proteger os dados. Nenhum sistema pode garantir segurança absoluta; entre em contato conosco se identificar uma possível exposição."
  ] },
  { id: "direitos", label: "Seus direitos e contato", body: [
    "Você pode solicitar confirmação e acesso aos seus dados, correção, informação sobre compartilhamento, anonimização ou eliminação quando cabível, além dos demais direitos previstos na LGPD.",
    "Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato pela página de contato da LEAMSE. Poderemos solicitar informações para confirmar sua identidade e responder à solicitação."
  ] }
];

export default function PrivacyPage() {
  const { topic } = useParams();
  return <InfoPageLayout title="Política de Privacidade" subtitle="Saiba como os dados pessoais são tratados ao utilizar os serviços LEAMSE." sections={SECTIONS} testId="privacy-page" basePath="/privacidade" activeId={topic} />;
}
