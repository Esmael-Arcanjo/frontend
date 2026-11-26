import { useParams } from "react-router-dom";
import { InfoPageLayout } from "../layouts/InfoPageLayout";

const SECTIONS = [
  { id: "conta", label: "Conta e cadastro", body: [
    "Para criar uma conta, informe dados verdadeiros e mantenha-os atualizados. Você é responsável por proteger suas credenciais e pelas atividades realizadas em sua conta.",
    "Se suspeitar de acesso não autorizado, avise a LEAMSE pelos canais da página de contato."
  ] },
  { id: "uso", label: "Uso dos serviços", body: [
    "Use a plataforma e seus produtos de acordo com a legislação aplicável e com estes termos. Não utilize os serviços para violar direitos de terceiros, tentar obter acesso não autorizado ou comprometer a segurança e a disponibilidade da plataforma.",
    "Você deve ter autorização para inserir e tratar dados de terceiros nos serviços."
  ] },
  { id: "planos", label: "Planos e pagamentos", body: [
    "Funcionalidades, limites, preços e condições de cada plano são apresentados na página do produto ou no momento da contratação.",
    "Quando houver cobrança recorrente, as condições de renovação e cancelamento seguem as informações apresentadas na contratação e as regras aplicáveis. Serviços de pagamento podem ser processados por provedores terceiros."
  ] },
  { id: "disponibilidade", label: "Disponibilidade e alterações", body: [
    "A LEAMSE busca manter os serviços disponíveis e seguros, mas pode realizar manutenções, atualizações ou alterações necessárias. Quando possível, mudanças relevantes serão comunicadas pelos canais disponíveis.",
    "O acesso poderá ser limitado quando necessário para proteger a plataforma, cumprir a lei ou responder a uso contrário a estes termos."
  ] },
  { id: "propriedade", label: "Propriedade intelectual", body: [
    "A plataforma, suas marcas e seus materiais pertencem à LEAMSE ou a seus licenciantes. Estes termos concedem apenas uma autorização limitada de uso dos serviços contratados e não transferem direitos de propriedade intelectual.",
    "Você mantém os direitos sobre o conteúdo que envia e declara possuir as permissões necessárias para utilizá-lo nos serviços."
  ] },
  { id: "contato", label: "Dúvidas e contato", body: [
    "Estes termos são aplicados conforme a legislação brasileira. Para dúvidas ou solicitações, entre em contato pela página de contato da LEAMSE."
  ] }
];

export default function TermsPage() {
  const { topic } = useParams();
  return <InfoPageLayout title="Termos de Uso" subtitle="Condições para criar uma conta e utilizar os serviços LEAMSE." sections={SECTIONS} testId="terms-page" basePath="/termos" activeId={topic} />;
}
