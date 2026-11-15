import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { useBioApi, useLoad } from "../hooks/useBioApi";
import { BioView } from "../components/BioView";
import type { BioLink, BioPage, Theme } from "../types/bio";

type Preset = { name: string; background: string; text: string; card: string };
const STYLES = [["rounded", "Arredondado"], ["pill", "Pílula"], ["square", "Reto"]] as const;

export default function AppearancePage() {
  const api = useBioApi();
  const { data, error, reload } = useLoad(useCallback(async () => {
    const [meta, theme, page, links] = await Promise.all([api.meta(), api.theme(), api.page(), api.links()]);
    return { presets: meta.presets as Record<string, Preset>, theme: theme as Theme, page: page as BioPage, links: links as BioLink[] };
  }, [api]));
  const [theme, setTheme] = useState({ preset: "grafite", accent: "#111827", button_style: "rounded" });
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) setTheme({ preset: data.theme.preset, accent: data.theme.accent, button_style: data.theme.button_style }); }, [data]);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <LoadingState />;
  const save = async () => { setBusy(true); try { await api.saveTheme(theme); toast.success("Aparência salva"); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); } };
  const p = data.page;
  const preview = { ...p, links: data.links.filter((l) => l.active), theme: { ...data.presets[theme.preset], ...theme } as Theme };

  return (
    <div className="space-y-6" data-testid="bio-appearance-page">
      <PageTitle title="Aparência" subtitle="Tema, cor de destaque e formato dos botões." actions={<Button onClick={save} disabled={busy} className="rounded-full" data-testid="bio-theme-save">{busy ? "Salvando..." : "Salvar aparência"}</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Object.entries(data.presets).map(([key, pr]) => (
              <button key={key} type="button" onClick={() => setTheme({ ...theme, preset: key })} data-testid={`bio-preset-${key}`}
                className={`overflow-hidden rounded-xl border text-left transition-shadow ${theme.preset === key ? "ring-2 ring-[color:var(--product)]" : "border-border hover:shadow-md"}`}>
                <div className="flex h-20 items-center justify-center" style={{ background: pr.background }}><span className="h-3 w-16 rounded-full" style={{ background: pr.card }} /></div>
                <p className="p-3 text-sm font-semibold">{pr.name}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-3 text-sm font-medium">Cor de destaque
              <input type="color" value={theme.accent} onChange={(e) => setTheme({ ...theme, accent: e.target.value })} className="h-10 w-14 cursor-pointer rounded border border-border" data-testid="bio-accent-input" />
            </label>
            <div className="flex gap-2">
              {STYLES.map(([k, label]) => (
                <button key={k} type="button" onClick={() => setTheme({ ...theme, button_style: k })} data-testid={`bio-button-style-${k}`}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${theme.button_style === k ? "border-[color:var(--product)] bg-[color:var(--product)] text-white" : "border-border hover:bg-muted"}`}>{label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-fit overflow-hidden rounded-[2rem] border-8 border-foreground shadow-xl" data-testid="bio-theme-preview"><BioView bio={preview} compact /></div>
      </div>
    </div>
  );
}
