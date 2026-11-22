import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PublicLayout } from "./PublicLayout";

export type InfoSection = { id: string; label: string; body: string[] };

type Props = { title: string; subtitle: string; sections: InfoSection[]; testId: string; basePath: string; activeId?: string };

export const InfoPageLayout = ({ title, subtitle, sections, testId, basePath, activeId }: Props) => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  const active = sections.find((s) => s.id === activeId);
  const shown = active ? [active] : sections;
  return (
    <PublicLayout>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[240px_1fr]" data-testid={testId}>
        <aside className="h-fit space-y-1 lg:sticky lg:top-24">
          {sections.map((s) => (
            <Link key={s.id} to={`${basePath}/${s.id}`} className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground ${s.id === activeId ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground"}`} data-testid={`${testId}-toc-${s.id}`}>{s.label}</Link>
          ))}
        </aside>
        <div>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl" data-testid={`${testId}-title`}>{active ? active.label : title}</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
          <div className="mt-12 space-y-12">
            {shown.map((s) => (
              <section key={s.id} id={s.id} className="rounded-2xl border border-border bg-card p-8" data-testid={`${testId}-section-${s.id}`}>
                {!active && <h2 className="font-display text-2xl font-extrabold">{s.label}</h2>}
                <div className={`space-y-3 text-sm text-muted-foreground md:text-base ${active ? "" : "mt-4"}`}>{s.body.map((p) => <p key={p}>{p}</p>)}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
