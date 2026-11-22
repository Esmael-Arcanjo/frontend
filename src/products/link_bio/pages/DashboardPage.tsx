import { useCallback } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Eye, Link2, MousePointerClick, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useBioApi, useLoad } from "../hooks/useBioApi";
import { StatCard } from "../components/StatCard";
import { SeriesBars } from "../components/SeriesBars";
import { BioQrCard } from "../components/BioQrCard";

export const publicUrl = (handle: string) => `${window.location.origin}/b/${handle}`;

export default function DashboardPage() {
  const api = useBioApi();
  const { data, error, reload } = useLoad(useCallback(() => api.overview(), [api]));
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <LoadingState />;
  const url = publicUrl(data.handle);
  const copy = async () => { await navigator.clipboard.writeText(url); toast.success("Endereço copiado"); };

  return (
    <div className="space-y-6" data-testid="bio-dashboard">
      <PageTitle title="Painel" subtitle="Desempenho da sua página nos últimos 7 dias." />
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center" data-testid="bio-public-url-card">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Seu endereço público</p>
          <p className="mt-1 truncate font-mono text-sm font-semibold" data-testid="bio-public-url">{url}</p>
          <p className={`mt-1 text-xs font-semibold ${data.published ? "text-success" : "text-warning"}`}>{data.published ? "Publicada" : "Não publicada — visitantes não conseguem ver"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={copy} data-testid="bio-copy-url"><Copy className="mr-1 h-4 w-4" /> Copiar</Button>
          <Button asChild className="rounded-full"><a href={url} target="_blank" rel="noopener noreferrer" data-testid="bio-open-public"><ExternalLink className="mr-1 h-4 w-4" /> Abrir</a></Button>
        </div>
      </div>
      <BioQrCard url={url} handle={data.handle} locked={data.is_free} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitas (7d)" value={data.views_7d} icon={Eye} testId="bio-kpi-views" />
        <StatCard label="Cliques (7d)" value={data.clicks_7d} icon={MousePointerClick} testId="bio-kpi-clicks" />
        <StatCard label="Cliques por visita" value={data.ctr_7d} icon={Percent} testId="bio-kpi-ctr" />
        <StatCard label="Links ativos" value={`${data.links_active}/${data.links_total}`} icon={Link2} testId="bio-kpi-links" />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 xl:col-span-2"><h2 className="font-display text-base font-bold">Visitas por dia</h2><SeriesBars series={data.series} /></div>
        <div className="rounded-xl border border-border bg-card p-6" data-testid="bio-top-links">
          <h2 className="font-display text-base font-bold">Links mais clicados</h2>
          {data.top_links.length === 0 ? <div className="mt-4"><EmptyState title="Ainda sem cliques" description="Compartilhe seu endereço nas redes sociais." /></div> : (
            <ul className="mt-4 divide-y divide-border">{data.top_links.map((l: { id: string; title: string; clicks: number }) => <li key={l.id} className="flex justify-between py-2 text-sm"><span className="truncate pr-3">{l.title}</span><span className="font-mono">{l.clicks}</span></li>)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
