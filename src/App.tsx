import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/shared/auth/AuthContext";
import { LoadingState } from "@/shared/components/States";
import HomePage from "@/website/pages/HomePage";
import ProductPage from "@/website/pages/ProductPage";
import CheckoutPage from "@/website/pages/CheckoutPage";
import PaymentSuccessPage from "@/website/pages/PaymentSuccessPage";
import PaymentCancelPage from "@/website/pages/PaymentCancelPage";
import LoginPage from "@/website/pages/LoginPage";
import RegisterPage from "@/website/pages/RegisterPage";
import VerifyEmailPage from "@/website/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/website/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/website/pages/ResetPasswordPage";
import AcceptInvitePage from "@/website/pages/AcceptInvitePage";
import AccountPage from "@/website/pages/AccountPage";
import NotFoundPage from "@/website/pages/NotFoundPage";
import SegmentPage from "@/website/pages/SegmentPage";
import SecurityPage from "@/website/pages/SecurityPage";
import CompanyPage from "@/website/pages/CompanyPage";
import PricingPage from "@/website/pages/PricingPage";
import ContactPage from "@/website/pages/ContactPage";
import TermsPage from "@/website/pages/TermsPage";
import PrivacyPage from "@/website/pages/PrivacyPage";
import { CookieConsent } from "@/website/components/CookieConsent";

// Each product dashboard is an independent bundle (code-split) mounted on its own address.
const CrmApp = lazy(() => import("@/products/crm/CrmApp"));
const AdminApp = lazy(() => import("@/admin/AdminApp"));
const ErpApp = lazy(() => import("@/products/erp/ErpApp"));
const EmailApiApp = lazy(() => import("@/products/email_api/EmailApiApp"));
const PaymentsApiApp = lazy(() => import("@/products/payments_api/PaymentsApiApp"));
const MarketplaceApp = lazy(() => import("@/products/marketplace/MarketplaceApp"));
const RecebimentoApp = lazy(() => import("@/products/recebimento/RecebimentoApp"));
const MarketingApp = lazy(() => import("@/products/marketing/MarketingApp"));
const ChatbotApp = lazy(() => import("@/products/chatbot/ChatbotApp"));
const LinkBioApp = lazy(() => import("@/products/link_bio/LinkBioApp"));
const AssinaturaDocsApp = lazy(() => import("@/products/assinatura_docs/AssinaturaDocsApp"));
const RhApp = lazy(() => import("@/products/rh/RhApp"));
const PublicBioPage = lazy(() => import("@/products/link_bio/public/PublicBioPage"));

const PRODUCT_BASE_PATHS = [
  "/crm",
  "/erp",
  "/email-api",
  "/payments-api",
  "/marketplace",
  "/recebimento",
  "/marketing",
  "/chatbot",
  "/link-bio",
  "/assinatura-documentos",
  "/rh",
];

const ProductFrameNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.parent === window) return;
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const message = event.data;
      if (typeof message !== "object" || message === null || !("type" in message) || !("path" in message)) return;
      if (message.type !== "LEAMSE_ACCOUNT_NAVIGATE" || typeof message.path !== "string") return;
      const target = new URL(message.path, window.location.origin);
      if (target.origin !== window.location.origin) return;
      if (!PRODUCT_BASE_PATHS.some((basePath) => target.pathname === basePath || target.pathname.startsWith(`${basePath}/`))) return;
      const targetLocation = `${target.pathname}${target.search}${target.hash}`;
      const currentLocation = `${location.pathname}${location.search}${location.hash}`;
      if (targetLocation !== currentLocation) navigate(targetLocation);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "LEAMSE_PRODUCT_NAVIGATED", path: `${location.pathname}${location.search}${location.hash}` },
        window.location.origin,
      );
    }
  }, [location.hash, location.pathname, location.search]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ProductFrameNavigation />
      <AuthProvider>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produtos/:slug" element={<ProductPage />} />
            <Route path="/contratar/:slug" element={<CheckoutPage />} />
            <Route path="/pagamento/sucesso" element={<PaymentSuccessPage />} />
            <Route path="/pagamento/cancelado" element={<PaymentCancelPage />} />
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/verificar-email" element={<VerifyEmailPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
            <Route path="/convite" element={<AcceptInvitePage />} />
            <Route path="/minha-conta" element={<AccountPage />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/crm/*" element={<CrmApp />} />
            <Route path="/erp/*" element={<ErpApp />} />
            <Route path="/email-api/*" element={<EmailApiApp />} />
            <Route path="/payments-api/*" element={<PaymentsApiApp />} />
            <Route path="/marketplace/*" element={<MarketplaceApp />} />
            <Route path="/recebimento/*" element={<RecebimentoApp />} />
            <Route path="/marketing/*" element={<MarketingApp />} />
            <Route path="/chatbot/*" element={<ChatbotApp />} />
            <Route path="/link-bio/*" element={<LinkBioApp />} />
            <Route path="/assinatura-documentos/*" element={<AssinaturaDocsApp />} />
            <Route path="/rh/*" element={<RhApp />} />
            <Route path="/b/:handle" element={<PublicBioPage />} />
            <Route path="/segmentos/:key" element={<SegmentPage />} />
            <Route path="/seguranca" element={<SecurityPage />} />
            <Route path="/seguranca/:topic" element={<SecurityPage />} />
            <Route path="/empresas" element={<CompanyPage />} />
            <Route path="/empresas/:topic" element={<CompanyPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/precos" element={<PricingPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/termos/:topic" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPage />} />
            <Route path="/privacidade/:topic" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </AuthProvider>
    </BrowserRouter>
  );
}
