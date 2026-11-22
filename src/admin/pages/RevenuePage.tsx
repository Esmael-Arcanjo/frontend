import { useEffect, useState } from "react";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { adminApi, brl, Revenue } from "../adminApi";

export default function RevenuePage() {
  const [data, setData] = useState<Revenue | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { adminApi.revenue().then(setData).catch((e) => setError(errMsg(e))); }, []);
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;
  const max = Math.max(1, ...data.months.map((m) => m.total));
  return (
    <div className="space-y-6" data-testid="admin-revenue">
      <PageTitle title="Faturamento" subtitle="Pagamentos confirmados pela Stripe (cartão e Pix)." />
      {!data.months.length ? <EmptyState title="Nenhum pagamento confirmado ainda" description="Os pagamentos aparecem aqui assim que forem confirmados." /> : (
        <>
          <div className="space-y-2 rounded-xl border border-border bg-card p-6" data-testid="admin-revenue-months">
            {data.months.map((m) => (
              <div key={m.month} className="flex items-center gap-3 text-sm">
                <span className="w-20 font-mono text-xs">{m.month}</span>
                <div className="h-3 flex-1 rounded-full bg-muted"><div className="h-3 rounded-full bg-primary" style={{ width: `${(m.total / max) * 100}%` }} /></div>
                <span className="w-28 text-right font-semibold">{brl(m.total)}</span>
              </div>
            ))}
          </div>
          <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[600px] text-sm"><thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground"><tr><th className="p-4">Data</th><th className="p-4">Cliente</th><th className="p-4">Produto</th><th className="p-4 text-right">Valor</th></tr></thead>
              <tbody className="divide-y divide-border">{data.recent.map((r) => <tr key={r.id}><td className="p-4 text-xs">{new Date(r.created_at).toLocaleDateString("pt-BR")}</td><td className="p-4 text-xs">{r.email}</td><td className="p-4 text-xs">{r.product_key}</td><td className="p-4 text-right font-semibold">{brl(r.amount)}</td></tr>)}</tbody></table>
          </div>
        </>
      )}
    </div>
  );
}
