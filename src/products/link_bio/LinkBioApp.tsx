import { Navigate, Route, Routes } from "react-router-dom";
import { ProductAccessGuard } from "@/shared/product/ProductAccessGuard";
import { LinkBioLayout } from "./layouts/LinkBioLayout";
import { PRODUCT_KEY, PRODUCT_NAME } from "./utils/constants";
import DashboardPage from "./pages/DashboardPage";
import PageEditorPage from "./pages/PageEditorPage";
import LinksPage from "./pages/LinksPage";
import AppearancePage from "./pages/AppearancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BillingPage from "./pages/BillingPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SecurityPage from "./pages/SecurityPage";
import SessionsPage from "./pages/SessionsPage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpPage from "./pages/HelpPage";

export default function LinkBioApp() {
  return (
    <ProductAccessGuard productKey={PRODUCT_KEY} productName={PRODUCT_NAME}>
      <Routes>
        <Route element={<LinkBioLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pagina" element={<PageEditorPage />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="aparencia" element={<AppearancePage />} />
          <Route path="metricas" element={<AnalyticsPage />} />
          <Route path="assinatura" element={<BillingPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="seguranca" element={<SecurityPage />} />
          <Route path="sessoes" element={<SessionsPage />} />
          <Route path="notificacoes" element={<NotificationsPage />} />
          <Route path="ajuda" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Routes>
    </ProductAccessGuard>
  );
}
