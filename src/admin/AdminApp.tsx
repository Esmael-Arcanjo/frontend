import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { BarChart3, CalendarClock, Gift, LogOut, Users, Wallet } from "lucide-react";
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
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const nameParts = user?.name.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials =
    nameParts.length > 0
      ? nameParts.slice(0, 2).map((part) => part[0]).join("").toUpperCase()
      : "?";
  const exitAdmin = async () => {
    await logout();
    navigate("/", { replace: true });
  };
  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/entrar?next=/admin" replace />;
  if (!user.is_admin) return <Navigate to="/minha-conta" replace />;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row" data-testid="admin-app">
      <aside className="border-b border-border bg-card p-4 md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r">
        <div className="mb-4 flex items-center justify-between md:mb-8">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">ADMIN</span>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground md:hidden" data-testid="admin-profile-mobile">
              {initials}
            </div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-1 md:flex-col">
          {NAV.map((n) => (
            <NavLink key={n.id} to={`/admin${n.to ? `/${n.to}` : ""}`} end={!n.to} data-testid={`admin-nav-${n.id}`}
              className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <n.icon className="h-4 w-4" />{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-3 border-t border-border pt-4 md:mt-auto md:space-y-3">
          <div className="hidden items-center gap-3 rounded-lg bg-muted/60 p-3 md:flex" data-testid="admin-profile">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={exitAdmin}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            data-testid="admin-logout"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8 md:ml-64">
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
