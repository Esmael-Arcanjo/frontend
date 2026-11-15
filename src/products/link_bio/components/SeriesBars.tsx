type Point = { date: string; views: number; clicks: number };

export const SeriesBars = ({ series }: { series: Point[] }) => {
  const max = Math.max(1, ...series.map((s) => Math.max(s.views, s.clicks)));
  return (
    <div className="mt-5" data-testid="bio-series">
      <div className="flex h-44 items-end gap-1">
        {series.map((s) => (
          <div key={s.date} className="group relative flex h-full flex-1 items-end gap-0.5" title={`${s.date}: ${s.views} visitas, ${s.clicks} cliques`}>
            <div className="flex-1 rounded-t bg-[color:var(--product)] transition-[height] duration-500" style={{ height: `${(s.views / max) * 100}%`, minHeight: 2 }} />
            <div className="flex-1 rounded-t bg-accent transition-[height] duration-500" style={{ height: `${(s.clicks / max) * 100}%`, minHeight: 2 }} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-muted-foreground"><span>{series[0]?.date.slice(5)}</span><span className="flex gap-3"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-[color:var(--product)]" />Visitas</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-accent" />Cliques</span></span><span>{series[series.length - 1]?.date.slice(5)}</span></div>
    </div>
  );
};
