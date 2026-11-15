import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { useBioApi, useLoad } from "../hooks/useBioApi";
import { AvatarUploader } from "../components/AvatarUploader";
import { SocialDraft, SocialsEditor } from "../components/SocialsEditor";
import { BioView } from "../components/BioView";
import type { BioLink, BioPage, Theme } from "../types/bio";

const toDraft = (url: string, network: string) => (network === "whatsapp" ? url.replace("https://wa.me/", "") : network === "email" ? url.replace("mailto:", "") : url);

export default function PageEditorPage() {
  const api = useBioApi();
  const { data, error, reload, setData } = useLoad(useCallback(async () => {
    const [page, meta, links, theme] = await Promise.all([api.page(), api.meta(), api.links(), api.theme()]);
    return { page: page as BioPage, networks: meta.networks as Record<string, string>, links: links as BioLink[], theme: theme as Theme };
  }, [api]));
  const [form, setForm] = useState({ profile_type: "person", display_name: "", title: "", description: "", location: "", show_map: true });
  const [socials, setSocials] = useState<SocialDraft[]>([]);
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    const p = data.page;
    setForm({ profile_type: p.profile_type, display_name: p.display_name, title: p.title || "", description: p.description || "", location: p.location || "", show_map: p.show_map });
    setSocials(p.socials.map((s) => ({ network: s.network, value: toDraft(s.url, s.network) })));
    setHandle(p.handle);
  }, [data]);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <LoadingState />;
  const page = data.page;
  const setPage = (p: BioPage) => setData({ ...data, page: p });
  const company = form.profile_type === "company";

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const p = await api.saveProfile({ ...form, title: form.title || null, description: form.description || null, location: form.location || null,
        socials: socials.filter((s) => s.value.trim()), version: page.version });
      setPage(p); toast.success("Página salva");
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const saveHandle = async () => { try { setPage(await api.saveHandle(handle.trim().toLowerCase())); toast.success("Endereço atualizado"); } catch (e) { toast.error(errMsg(e)); } };
  const togglePublish = async (v: boolean) => { try { setPage(await api.publish(v)); toast.success(v ? "Página publicada" : "Página despublicada"); } catch (e) { toast.error(errMsg(e)); } };
  const preview = { ...form, profile_type: form.profile_type as "person" | "company", title: form.title || null, description: form.description || null, location: form.location || null,
    handle: page.handle, avatar: page.avatar, socials: socials.filter((s) => s.value.trim()).map((s) => ({ network: s.network, url: "#" })),
    links: data.links.filter((l) => l.active), theme: data.theme };

  return (
    <div className="space-y-6" data-testid="bio-editor-page">
      <PageTitle title="Minha página" subtitle="Perfil, foto, redes sociais e localização." />
      <div className="grid gap-6 2xl:grid-cols-[1fr_420px] xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:flex-row md:items-end">
            <div className="flex-1 space-y-2"><Label htmlFor="bio-handle">Endereço (leamse.com/b/...)</Label>
              <Input id="bio-handle" value={handle} onChange={(e) => setHandle(e.target.value)} data-testid="bio-handle-input" /></div>
            <Button variant="outline" onClick={saveHandle} disabled={handle === page.handle} data-testid="bio-handle-save">Salvar endereço</Button>
            <label className="flex items-center gap-2 text-sm font-medium"><Switch checked={page.published} onCheckedChange={togglePublish} data-testid="bio-publish-switch" /> Publicada</label>
          </div>
          <form onSubmit={save} className="space-y-5 rounded-xl border border-border bg-card p-6" data-testid="bio-profile-form">
            <div className="grid grid-cols-2 gap-3">
              {[["person", "Pessoa", User], ["company", "Empresa", Building2]].map(([key, label, Icon]: any) => (
                <button key={key} type="button" onClick={() => setForm({ ...form, profile_type: key })} data-testid={`bio-type-${key}`}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition-colors ${form.profile_type === key ? "border-[color:var(--product)] bg-[color:var(--product)]/5 ring-1 ring-[color:var(--product)]" : "border-border hover:bg-muted"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
            <AvatarUploader avatar={page.avatar} onUpload={async (d) => setPage(await api.setAvatar(d))} onRemove={async () => setPage(await api.removeAvatar())} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="bio-name">{company ? "Nome da empresa" : "Seu nome"}</Label>
                <Input id="bio-name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} data-testid="bio-name-input" /></div>
              <div className="space-y-2"><Label htmlFor="bio-title">{company ? "Ramo de atividade" : "Título profissional"}</Label>
                <Input id="bio-title" placeholder={company ? "Ex.: Clínica odontológica" : "Ex.: Advogada tributarista"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="bio-title-input" /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="bio-desc">Descrição</Label>
                <Textarea id="bio-desc" maxLength={500} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="bio-description-input" /></div>
              <div className="space-y-2"><Label htmlFor="bio-loc">Localização</Label>
                <Input id="bio-loc" placeholder="Cidade, estado ou endereço" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="bio-location-input" /></div>
              <label className="flex items-center gap-2 self-end pb-2 text-sm"><Switch checked={form.show_map} onCheckedChange={(v: boolean) => setForm({ ...form, show_map: v })} data-testid="bio-map-switch" /> Abrir no mapa ao clicar</label>
            </div>
            <div className="space-y-2"><Label>Redes sociais (exibidas só como ícones)</Label><SocialsEditor networks={data.networks} items={socials} onChange={setSocials} /></div>
            <Button type="submit" disabled={busy} className="rounded-full" data-testid="bio-profile-save">{busy ? "Salvando..." : "Salvar página"}</Button>
          </form>
        </div>
        <div className="h-fit overflow-hidden rounded-[2rem] border-8 border-foreground shadow-xl xl:sticky xl:top-24" data-testid="bio-live-preview"><BioView bio={preview} compact /></div>
      </div>
    </div>
  );
}
