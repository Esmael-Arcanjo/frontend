import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { PublicLayout } from "../layouts/PublicLayout";
import { CheckoutStep, OptionTile } from "../components/CheckoutStep";
import { fetchProduct, formatPrice, Plan, Product, Segment } from "../services/catalog";
import { startCheckout } from "../services/billing";

export default function CheckoutPage() {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const [data, setData] = useState<{ product: Product; plans: Plan[]; segments: Segment[] } | null>(null);
  const [error, setError] = useState("");
  const [segment, setSegment] = useState(params.get("segmento") || "");
  const [plan, setPlan] = useState(params.get("plano") || "");
  const [org, setOrg] = useState({ name: "", document: "", country: "BR" });
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"card" | "pix">("card");
  const navigate = useNavigate();
  const [current, setCurrent] = useState<{ organization_id: string; organization_name: string; segment: string; plan_key: string } | null>(null);

  useEffect(() => { fetchProduct(slug).then(setData).catch((e) => setError(errMsg(e))); }, [slug]);
  useEffect(() => {
    if (!user || !data) return;
    api.get(`/api/v1/billing/${data.product.key}/current`).then((r) => {
      if (r.data.current) { setCurrent(r.data.current); setSegment(r.data.current.segment); }
    }).catch(() => undefined);
  }, [user, data]);

  if (error) return <PublicLayout><div className="p-10"><ErrorState message={error} /></div></PublicLayout>;
  if (!data) return <PublicLayout><LoadingState /></PublicLayout>;
  const { product, plans, segments } = data;
  if (product.status !== "available") return <PublicLayout><div className="p-10"><ErrorState message="Este produto ainda não está disponível para contratação." /></div></PublicLayout>;

  const selectedPlan = plans.find((p) => p.plan_key === plan);
  const ready = segment && selectedPlan && (current || org.name.trim().length >= 2) && user;
  const next = `${location.pathname}?plano=${plan}&segmento=${segment}`;

  const free = selectedPlan?.price_cents === 0;

  const pay = async () => {
    setBusy(true);
    try {
      const res = await startCheckout({
        product_key: product.key, plan_key: plan, segment,
        ...(current ? { organization_id: current.organization_id }
          : { organization: { name: org.name.trim(), document: org.document.trim() || null, country: org.country } }),
        origin_url: window.location.origin, payment_method: method,
      } as Parameters<typeof startCheckout>[0]) as { checkout_url: string | null; activated?: boolean; changed?: boolean; slug?: string };
      if (res.activated) { toast.success(res.changed ? "Plano alterado!" : "Plano ativado!"); navigate(`/${res.slug}`); return; }
      window.location.href = res.checkout_url!;
    } catch (e) {
      toast.error(errMsg(e));
      setBusy(false);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3" data-testid="checkout-page">
        <div className="space-y-5 lg:col-span-2">
          <h1 className="font-display text-3xl font-extrabold" data-testid="checkout-title">{current ? `Trocar plano do ${product.name}` : `Contratar ${product.name}`}</h1>
          {current && <p className="rounded-xl bg-secondary px-4 py-3 text-sm" data-testid="checkout-change-plan">Você já usa este produto em <b>{current.organization_name}</b>. Vamos manter seu segmento e seus dados; escolha só o novo plano.</p>}
          {!current && <CheckoutStep n={1} title="Segmento de mercado" done={!!segment}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {segments.map((s) => <OptionTile key={s.key} active={segment === s.key} onClick={() => setSegment(s.key)} testId={`checkout-segment-${s.key}`}><span className="text-sm font-semibold">{s.name}</span></OptionTile>)}
            </div>
          </CheckoutStep>}
          <CheckoutStep n={current ? 1 : 2} title="Plano" done={!!selectedPlan}>
            <div className="grid gap-3 md:grid-cols-3">
              {plans.filter((p) => !current || p.plan_key !== current.plan_key).map((p) => (
                <OptionTile key={p.plan_key} active={plan === p.plan_key} onClick={() => setPlan(p.plan_key)} testId={`checkout-plan-${p.plan_key}`}>
                  <span className="block font-display font-bold">{p.name}</span>
                  <span className="text-sm text-muted-foreground">{formatPrice(p.price_cents, p.currency)}{p.interval === "year" ? "/ano" : "/mês"}</span>
                </OptionTile>
              ))}
            </div>
          </CheckoutStep>
          {!current && <CheckoutStep n={3} title="Dados da organização" done={org.name.trim().length >= 2}>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2"><Label htmlFor="org-name">Nome da empresa</Label>
                <Input id="org-name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} data-testid="checkout-org-name" /></div>
              <div className="space-y-2"><Label htmlFor="org-doc">CNPJ/CPF (opcional)</Label>
                <Input id="org-doc" value={org.document} onChange={(e) => setOrg({ ...org, document: e.target.value })} data-testid="checkout-org-document" /></div>
            </div>
          </CheckoutStep>}
          <CheckoutStep n={current ? 2 : 4} title="Sua conta" done={!!user}>
            {user ? (
              <p className="text-sm" data-testid="checkout-account-ok">Contratando como <b>{user.name}</b> ({user.email}).</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full"><Link to={`/cadastro?next=${encodeURIComponent(next)}`} data-testid="checkout-register">Criar conta</Link></Button>
                <Button asChild variant="outline" className="rounded-full"><Link to={`/entrar?next=${encodeURIComponent(next)}`} data-testid="checkout-login">Já tenho conta</Link></Button>
              </div>
            )}
          </CheckoutStep>
        </div>
        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24" data-testid="checkout-summary">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Resumo</p>
          <p className="font-display text-xl font-extrabold">{product.name}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Segmento</dt><dd>{segments.find((s) => s.key === segment)?.name || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Plano</dt><dd>{selectedPlan?.name || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Empresa</dt><dd className="truncate pl-4">{org.name || "—"}</dd></div>
          </dl>
          <p className="border-t border-border pt-4 font-display text-2xl font-extrabold" data-testid="checkout-total">{selectedPlan ? `${formatPrice(selectedPlan.price_cents, selectedPlan.currency)}${selectedPlan.interval === "year" ? "/ano" : "/mês"}` : "—"}</p>
          {!free && (
            <div className="grid grid-cols-2 gap-2" data-testid="checkout-payment-method">
              {([["card", "Cartão"], ["pix", "Pix"]] as const).map(([k, label]) => (
                <OptionTile key={k} active={method === k} onClick={() => setMethod(k)} testId={`checkout-method-${k}`}><span className="text-sm font-semibold">{label}</span></OptionTile>
              ))}
            </div>
          )}
          <Button className="w-full rounded-full" size="lg" disabled={!ready || busy} onClick={pay} data-testid="checkout-pay-button">
            <Lock className="mr-2 h-4 w-4" /> {busy ? "Aguarde..." : free ? "Ativar plano grátis" : method === "pix" ? "Pagar com Pix" : "Pagar com cartão"}
          </Button>
          <p className="text-xs text-muted-foreground">{method === "pix" && !free ? "Pix é pago por período (mês ou ano) e não renova sozinho; você renova quando vencer." : "Pagamento processado pela Stripe em página segura. A assinatura só é ativada após confirmação do pagamento no servidor."}</p>
        </aside>
      </div>
    </PublicLayout>
  );
}
