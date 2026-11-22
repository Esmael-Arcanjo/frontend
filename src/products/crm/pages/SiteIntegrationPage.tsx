import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Copy, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";

type Site = { webhook_url: string; has_token: boolean; token_hint: string | null };
const EXAMPLE = `{
  "name": "Maria Souza",
  "whatsapp": "(11) 99999-0000",
  "city": "São Paulo",
  "intent": "anunciar",
  "wants": "Moto Honda CG 2020",
  "price": "R$ 12.000"
}`;

export default function SiteIntegrationPage() {
  const api = useCrmApi();
  const site = useAsyncData<Site>(useCallback(() => api.site(), [api]));
  const [token, setToken] = useState("");
  const copy = (v: string) => { navigator.clipboard.writeText(v); toast.success("Copiado"); };
  const rotate = async () => {
    try { const r = await api.rotateSiteToken(); setToken(r.token); site.reload(); } catch (e) { toast.error(errMsg(e)); }
  };
  if (site.error) return <ErrorState message={site.error} onRetry={site.reload} />;
  if (!site.data) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="crm-site-page">
      <PageTitle title="Integrações · Site" subtitle="Os formulários Quero Anunciar e Quero Comprar do leamse.com criam leads aqui automaticamente, na etapa Triagem do funil." />
      <div className="space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-bold">Webhook de leads</h2>
        <div className="flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2 text-xs" data-testid="site-webhook-url">POST {site.data.webhook_url}</code>
          <Button variant="outline" size="sm" onClick={() => copy(site.data!.webhook_url)} data-testid="site-webhook-copy"><Copy className="mr-1 h-4 w-4" /> Copiar</Button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-foreground p-4 text-xs text-background">{EXAMPLE}</pre>
        <p className="text-xs text-muted-foreground">O campo intent aceita anunciar, comprar ou contato. Se o mesmo WhatsApp enviar de novo, o lead é atualizado, não duplicado.</p>
      </div>
      <div className="space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-bold">Token para outros sites</h2>
        <p className="text-sm text-muted-foreground">Para receber leads de outro site, envie o cabeçalho <code>X-Webhook-Token</code> com este token.{site.data.has_token && ` Token atual termina em …${site.data.token_hint}.`}</p>
        {token && <div className="flex flex-wrap items-center gap-2" data-testid="site-token-value"><code className="rounded-lg bg-muted px-3 py-2 text-xs">{token}</code><Button variant="outline" size="sm" onClick={() => copy(token)}><Copy className="mr-1 h-4 w-4" /> Copiar</Button><span className="text-xs text-muted-foreground">Guarde agora: ele não será exibido de novo.</span></div>}
        <Button onClick={rotate} className="rounded-full" data-testid="site-token-generate"><KeyRound className="mr-1 h-4 w-4" /> {site.data.has_token ? "Gerar novo token" : "Gerar token"}</Button>
      </div>
    </div>
  );
}
