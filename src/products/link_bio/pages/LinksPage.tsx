import { FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useBioApi, useLoad } from "../hooks/useBioApi";
import type { BioLink } from "../types/bio";

export default function LinksPage() {
  const api = useBioApi();
  const { data, error, reload } = useLoad<BioLink[]>(useCallback(() => api.links(), [api]));
  const meta = useLoad<{ suggestions: string[] }>(useCallback(() => api.meta(), [api]));
  const [draft, setDraft] = useState({ title: "", url: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState({ title: "", url: "" });

  const run = async (fn: () => Promise<unknown>, msg?: string) => {
    try { await fn(); if (msg) toast.success(msg); reload(); } catch (e) { toast.error(errMsg(e)); reload(); }
  };
  const add = (e: FormEvent) => { e.preventDefault(); run(async () => { await api.createLink({ ...draft, active: true }); setDraft({ title: "", url: "" }); }, "Link adicionado"); };
  const move = (i: number, j: number) => { const ids = data!.map((l) => l.id); [ids[i], ids[j]] = [ids[j], ids[i]]; run(() => api.reorder(ids)); };

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="bio-links-page">
      <PageTitle title="Links" subtitle="Botões exibidos na sua página, na ordem abaixo." />
      <form onSubmit={add} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:flex-row" data-testid="bio-link-add-form">
        <Input required placeholder="Título do botão" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} data-testid="bio-link-title-input" />
        <Input required placeholder="https://..." value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} data-testid="bio-link-url-input" />
        <Button type="submit" className="rounded-full" data-testid="bio-link-add-button"><Plus className="mr-1 h-4 w-4" /> Adicionar</Button>
      </form>
      {meta.data && meta.data.suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" data-testid="bio-link-suggestions">
          <span className="text-xs text-muted-foreground">Sugestões para o seu segmento:</span>
          {meta.data.suggestions.map((s, i) => (
            <button key={s} type="button" onClick={() => setDraft({ ...draft, title: s })} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted" data-testid={`bio-link-suggestion-${i}`}>{s}</button>
          ))}
        </div>
      )}
      {data.length === 0 ? <EmptyState title="Nenhum link" description="Adicione seu primeiro botão acima." /> : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card" data-testid="bio-links-list">
          {data.map((l, i) => (
            <div key={l.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center" data-testid={`bio-link-row-${l.id}`}>
              {editing === l.id ? (
                <div className="flex flex-1 flex-col gap-2 md:flex-row">
                  <Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} data-testid={`bio-link-edit-title-${l.id}`} />
                  <Input value={edit.url} onChange={(e) => setEdit({ ...edit, url: e.target.value })} data-testid={`bio-link-edit-url-${l.id}`} />
                  <Button size="icon" onClick={() => run(async () => { await api.updateLink(l.id, { ...edit, active: l.active, version: l.version }); setEditing(null); }, "Link atualizado")} data-testid={`bio-link-save-${l.id}`}><Check className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditing(null)} data-testid={`bio-link-cancel-${l.id}`}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <div className="min-w-0 flex-1"><p className={`truncate text-sm font-semibold ${l.active ? "" : "text-muted-foreground"}`}>{l.title}</p><p className="truncate text-xs text-muted-foreground">{l.url} · {l.clicks} cliques</p></div>
              )}
              <div className="flex items-center gap-1">
                <Switch checked={l.active} onCheckedChange={(v: boolean) => run(() => api.updateLink(l.id, { title: l.title, url: l.url, active: v, version: l.version }))} aria-label="Ativo" data-testid={`bio-link-active-${l.id}`} />
                <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => move(i, i - 1)} data-testid={`bio-link-up-${l.id}`}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" disabled={i === data.length - 1} onClick={() => move(i, i + 1)} data-testid={`bio-link-down-${l.id}`}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(l.id); setEdit({ title: l.title, url: l.url }); }} data-testid={`bio-link-edit-${l.id}`}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => run(() => api.deleteLink(l.id), "Link removido")} data-testid={`bio-link-delete-${l.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
