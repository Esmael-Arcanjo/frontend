import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { BarChart3, CalendarClock, Gift, Users, Wallet } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";
import { LoadingState } from "@/shared/components/States";
import { Logo } from "@/website/components/Logo";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import GrantPage from "./pages/GrantPage";
import RevenuePage from "./pages/RevenuePage";

const NAV = [
  { to: "", label: "Visão geral", icon: BarChart3, id: "overview" },
  { to: "usuarios", label: "Usuários", icon: Users, id: "users" },
  { to: "assinaturas", label: "Assinaturas e prazos", icon: CalendarClock, id: "subscriptions" },
  { to: "liberar-plano", label: "Liberar plano grátis", icon: Gift, id: "grant" },
  { to: "faturamento", label: "Faturamento", icon: Wallet, id: "revenue" },
];

export default function AdminApp() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/entrar?next=/admin" replace />;
  if (!user.is_admin) return <Navigate to="/minha-conta" replace />;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row" data-testid="admin-app">
      <aside className="border-b border-border bg-card p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-4 flex items-center justify-between md:mb-8"><Logo /><span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">ADMIN</span></div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map((n) => (
            <NavLink key={n.id} to={`/admin${n.to ? `/${n.to}` : ""}`} end={!n.to} data-testid={`admin-nav-${n.id}`}
              className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <n.icon className="h-4 w-4" />{n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="assinaturas" element={<SubscriptionsPage />} />
          <Route path="liberar-plano" element={<GrantPage />} />
          <Route path="faturamento" element={<RevenuePage />} />
        </Routes>
      </main>
    </div>
  );
}
