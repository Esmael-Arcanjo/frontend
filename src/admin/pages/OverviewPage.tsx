import { useEffect, useState } from "react";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { adminApi, brl, Stats } from "../adminApi";

const Card = ({ label, value, id }: { label: string; value: string | number; id: string }) => (
  <div className="rounded-xl border border-border bg-card p-5" data-testid={`admin-stat-${id}`}>
    <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
  </div>
);

export default function OverviewPage() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { adminApi.stats().then(setS).catch((e) => setError(errMsg(e))); }, []);
  if (error) return <ErrorState message={error} />;
  if (!s) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="admin-overview">
      <PageTitle title="Visão geral" subtitle="Números de toda a plataforma LEAMSE." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card id="users" label="Usuários" value={s.users} />
        <Card id="orgs" label="Organizações" value={s.organizations} />
        <Card id="active" label="Assinaturas ativas" value={s.active_subscriptions} />
        <Card id="expiring" label="Vencem em 7 dias" value={s.expiring_7_days} />
        <Card id="paid" label="Pagas" value={s.paid_subscriptions} />
        <Card id="free" label="Grátis / cortesia" value={s.free_subscriptions} />
        <Card id="mrr" label="Receita mensal recorrente" value={brl(s.mrr_cents / 100)} />
        <Card id="revenue" label="Faturamento total" value={brl(s.revenue_total)} />
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold">Assinaturas ativas por produto</p>
        <div className="mt-3 flex flex-wrap gap-2">{Object.entries(s.by_product).map(([k, v]) => <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{k}: {v}</span>)}</div>
      </div>
    </div>
  );
}
