import { useCallback, useState } from "react";
import { Eye, MousePointerClick, Percent } from "lucide-react";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useBioApi, useLoad } from "../hooks/useBioApi";
import { StatCard } from "../components/StatCard";
import { SeriesBars } from "../components/SeriesBars";
import { SocialIcon } from "../components/SocialIcon";

export default function AnalyticsPage() {
  const api = useBioApi();
  const [days, setDays] = useState(30);
  const { data, error, reload } = useLoad(useCallback(() => api.analytics(days), [api, days]));
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="bio-analytics-page">
      <PageTitle title="Métricas" subtitle="Visitas únicas a cada 30 minutos por visitante e cliques registrados."
        actions={<div className="flex gap-1 rounded-full border border-border p-1">{[7, 30, 90].map((d) => (
          <button key={d} type="button" onClick={() => setDays(d)} className={`rounded-full px-3 py-1 text-xs font-semibold ${days === d ? "bg-foreground text-background" : ""}`} data-testid={`bio-analytics-days-${d}`}>{d} dias</button>
        ))}</div>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Visitas" value={data.views} icon={Eye} testId="bio-analytics-views" />
        <StatCard label="Cliques" value={data.clicks} icon={MousePointerClick} testId="bio-analytics-clicks" />
        <StatCard label="Cliques por visita" value={data.ctr} icon={Percent} testId="bio-analytics-ctr" />
      </div>
      <div className="rounded-xl border border-border bg-card p-6"><h2 className="font-display text-base font-bold">Evolução diária</h2><SeriesBars series={data.series} /></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6" data-testid="bio-analytics-links">
          <h2 className="font-display text-base font-bold">Cliques por link</h2>
          {data.top_links.length === 0 ? <div className="mt-4"><EmptyState title="Sem cliques no período" /></div> :
            <ul className="mt-4 divide-y divide-border">{data.top_links.map((l: { id: string; title: string; clicks: number }) => <li key={l.id} className="flex justify-between py-2 text-sm"><span className="truncate pr-3">{l.title}</span><span className="font-mono">{l.clicks}</span></li>)}</ul>}
        </div>
        <div className="rounded-xl border border-border bg-card p-6" data-testid="bio-analytics-socials">
          <h2 className="font-display text-base font-bold">Cliques em redes sociais</h2>
          {data.socials.length === 0 ? <div className="mt-4"><EmptyState title="Sem cliques no período" /></div> :
            <ul className="mt-4 divide-y divide-border">{data.socials.map((s: { network: string; clicks: number }) => <li key={s.network} className="flex items-center justify-between py-2 text-sm"><span className="flex items-center gap-2"><SocialIcon network={s.network} className="h-4 w-4" />{s.network}</span><span className="font-mono">{s.clicks}</span></li>)}</ul>}
        </div>
      </div>
    </div>
  );
}
