import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PublicLayout } from "./PublicLayout";

export type InfoSection = { id: string; label: string; body: string[] };

export const InfoPageLayout = ({ title, subtitle, sections, testId }: { title: string; subtitle: string; sections: InfoSection[]; testId: string }) => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);
  return (
    <PublicLayout>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[240px_1fr]" data-testid={testId}>
        <aside className="h-fit space-y-1 lg:sticky lg:top-24">
          {sections.map((s) => <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" data-testid={`${testId}-toc-${s.id}`}>{s.label}</a>)}
        </aside>
        <div>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
          <div className="mt-12 space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-8" data-testid={`${testId}-section-${s.id}`}>
                <h2 className="font-display text-2xl font-extrabold">{s.label}</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground md:text-base">{s.body.map((p) => <p key={p}>{p}</p>)}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
