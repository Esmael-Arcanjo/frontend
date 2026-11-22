import { useEffect, useState } from "react";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { AdminSub, adminApi, brl, dateOf } from "../adminApi";

const METHOD: Record<string, string> = { card: "Cartão", pix: "Pix", free: "Grátis", grant: "Cortesia" };

export default function SubscriptionsPage() {
  const [items, setItems] = useState<AdminSub[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { adminApi.subscriptions().then(setItems).catch((e) => setError(errMsg(e))); }, []);
  if (error) return <ErrorState message={error} />;
  if (!items) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="admin-subscriptions">
      <PageTitle title="Assinaturas e prazos" subtitle="Ordenadas pelas que vencem primeiro." />
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[820px] text-sm" data-testid="admin-subs-table">
          <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground"><tr><th className="p-4">Cliente</th><th className="p-4">Produto / plano</th><th className="p-4">Pagamento</th><th className="p-4">Status</th><th className="p-4">Vence em</th><th className="p-4">Dias restantes</th></tr></thead>
          <tbody className="divide-y divide-border">
            {items.map((s) => (
              <tr key={s.id} data-testid={`admin-sub-${s.id}`}>
                <td className="p-4"><p className="font-semibold">{s.organization || "—"}</p><p className="text-xs text-muted-foreground">{s.owner_email}</p></td>
                <td className="p-4">{s.product_key} · {s.plan_key}<p className="text-xs text-muted-foreground">{s.price_cents ? brl(s.price_cents / 100) : "Grátis"}</p></td>
                <td className="p-4 text-xs">{METHOD[s.billing_method] || s.billing_method}</td>
                <td className="p-4"><span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">{s.status}{s.cancel_at_period_end ? " (cancela no fim)" : ""}</span></td>
                <td className="p-4 text-xs">{dateOf(s.current_period_end)}</td>
                <td className={`p-4 font-mono text-xs ${s.days_left !== null && s.days_left <= 7 ? "font-bold text-destructive" : ""}`} data-testid={`admin-sub-days-${s.id}`}>{s.days_left ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
