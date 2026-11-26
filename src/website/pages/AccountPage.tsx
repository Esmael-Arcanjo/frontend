import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowUpRight, LogOut, MailWarning, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { mySubscriptions } from "../services/billing";
import { Logo } from "../components/Logo";

type Sub = Awaited<ReturnType<typeof mySubscriptions>>["subscriptions"][number];
const STATUS: Record<string, string> = { active: "Ativo", past_due: "Pagamento pendente", canceled: "Cancelada", expired: "Expirada", suspended: "Suspensa", pending: "Pendente" };

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (user) mySubscriptions().then((d) => setSubs(d.subscriptions.filter((s) => s.status === "active"))).catch((e) => setError(errMsg(e))); }, [user]);

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/entrar?next=/minha-conta" replace />;
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xl sm:px-6" data-testid="account-header">
        <Logo />
        {!user.email_verified && (
          <div className="absolute left-1/2 flex max-w-[42vw] -translate-x-1/2 items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-2.5 py-2 text-xs sm:px-3 sm:text-sm" data-testid="account-email-verification-header">
            <MailWarning className="h-4 w-4 shrink-0" />
            <span className="hidden truncate sm:inline lg:hidden">Confirme seu e-mail</span>
            <span className="hidden truncate lg:inline">Confirme seu e-mail: {user.email}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="rounded-md" data-testid="account-add-product">
            <Link to="/precos"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Assinar mais</span><span className="sm:hidden">Assinar</span></Link>
          </Button>
          {user.is_admin && <Button asChild variant="ghost" size="sm" className="hidden rounded-md sm:inline-flex"><Link to="/admin" data-testid="account-admin-header">Painel admin</Link></Button>}
          <span className="max-w-[24vw] truncate text-sm font-semibold sm:max-w-none" data-testid="account-header-name">{user.name}</span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-md"
            onClick={async () => { await logout(); navigate("/"); }}
            data-testid="account-header-logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14" data-testid="account-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold">Seus produtos</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cada produto abre em seu próprio painel.</p>
          </div>
        </div>
        {error ? <ErrorState message={error} /> : !subs ? <LoadingState /> : subs.length === 0 ? (
          <EmptyState title="Nenhum produto ativo" description="Escolha um produto para começar." action={<Button asChild className="rounded-full"><Link to="/precos" data-testid="account-browse">Ver produtos e preços</Link></Button>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {subs.map((s) => (
              <Link key={`${s.product_key}-${s.organization_name}`} to={`/${s.slug}`} className="group rounded-none border border-border bg-card p-6 transition-shadow hover:shadow-md" data-testid={`account-product-${s.product_key}`}>
                <div className="flex items-center justify-between"><p className="font-display text-lg font-extrabold">{s.product_name}</p><ArrowUpRight className="h-5 w-5" /></div>
                <p className="mt-1 text-sm text-muted-foreground">{s.organization_name} · plano {s.plan_key}</p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">{window.location.host}/{s.slug}</p>
                <span className="mt-3 inline-block rounded-none bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">{STATUS[s.status] || s.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
