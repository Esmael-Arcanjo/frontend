import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link2Off, QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { PasswordInput } from "@/shared/components/PasswordInput";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";

type Wa = { configured: boolean; status: string; base_url?: string; notify_number?: string | null; has_api_key?: boolean };
const STATUS: Record<string, string> = { open: "Conectado", connecting: "Aguardando leitura do QR Code", close: "Desconectado", not_configured: "Não configurado" };

const ConfigForm = ({ wa, onSaved }: { wa: Wa; onSaved: () => void }) => {
  const api = useCrmApi();
  const [form, setForm] = useState({ base_url: wa.base_url || "", api_key: "", notify_number: wa.notify_number || "" });
  const [busy, setBusy] = useState(false);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await api.saveWhatsapp({ ...form, api_key: form.api_key || null, notify_number: form.notify_number || null }); toast.success("Configuração salva"); onSaved(); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={save} className="space-y-4 rounded-xl border border-border bg-card p-6" data-testid="wa-config-form">
      <h2 className="font-display text-base font-bold">Servidor Evolution API</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2"><Label htmlFor="wa-url">URL do servidor (https)</Label><Input id="wa-url" placeholder="https://evolution.suaempresa.com" value={form.base_url} onChange={(e) => setForm({ ...form, base_url: e.target.value })} data-testid="wa-base-url" /></div>
        <div className="space-y-2"><Label htmlFor="wa-key">API key {wa.has_api_key && <span className="text-xs text-muted-foreground">(salva — deixe vazio para manter)</span>}</Label><PasswordInput id="wa-key" value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} data-testid="wa-api-key" /></div>
        <div className="space-y-2"><Label htmlFor="wa-notify">Seu WhatsApp para avisos de lead</Label><Input id="wa-notify" placeholder="(11) 99999-0000" value={form.notify_number} onChange={(e) => setForm({ ...form, notify_number: e.target.value })} data-testid="wa-notify-number" /></div>
      </div>
      <Button type="submit" disabled={busy} className="rounded-full" data-testid="wa-config-save">{busy ? "Salvando..." : "Salvar configuração"}</Button>
    </form>
  );
};

export default function WhatsAppPage() {
  const api = useCrmApi();
  const wa = useAsyncData<Wa>(useCallback(() => api.whatsapp(), [api]));
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const current = status || wa.data?.status || "";

  const connect = useCallback(async () => {
    setBusy(true);
    try { const r = await api.connectWhatsapp(); setQr(r.qr); setStatus(r.status); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  }, [api]);
  useEffect(() => {
    if (current !== "connecting") return;
    const poll = setInterval(async () => {
      try { const r = await api.whatsappStatus(); setStatus(r.status); if (r.status === "open") { setQr(null); toast.success("WhatsApp conectado!"); } } catch { /* retry next tick */ }
    }, 4000);
    const refreshQr = setInterval(connect, 40000);
    return () => { clearInterval(poll); clearInterval(refreshQr); };
  }, [current, api, connect]);
  const disconnect = async () => {
    try { await api.disconnectWhatsapp(); setStatus("close"); setQr(null); toast.success("WhatsApp desconectado"); } catch (e) { toast.error(errMsg(e)); }
  };

  if (wa.error) return <ErrorState message={wa.error} onRetry={wa.reload} />;
  if (!wa.data) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="crm-whatsapp-page">
      <PageTitle title="Integrações · WhatsApp" subtitle="Conecte pelo QR Code, igual ao WhatsApp Web. Quem mandar mensagem vira lead automaticamente." />
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-6">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${current === "open" ? "bg-primary text-primary-foreground" : "bg-muted"}`} data-testid="wa-status">{STATUS[current] || current}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          {current !== "open" && <Button onClick={connect} disabled={busy || !wa.data.configured} className="rounded-full" data-testid="wa-connect"><QrCode className="mr-1 h-4 w-4" /> {busy ? "Gerando..." : "Conectar WhatsApp"}</Button>}
          {current === "open" && <Button variant="outline" onClick={connect} className="rounded-full" data-testid="wa-reconnect"><RefreshCw className="mr-1 h-4 w-4" /> Conectar de novo</Button>}
          {(current === "open" || current === "connecting") && <Button variant="outline" onClick={disconnect} className="rounded-full" data-testid="wa-disconnect"><Link2Off className="mr-1 h-4 w-4" /> Desconectar</Button>}
        </div>
      </div>
      {qr && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center" data-testid="wa-qr">
          <img src={qr.startsWith("data:") ? qr : `data:image/png;base64,${qr}`} alt="QR Code do WhatsApp" className="h-64 w-64 rounded-lg bg-white p-2" />
          <p className="text-sm text-muted-foreground">No celular: WhatsApp → Configurações → Aparelhos conectados → Conectar aparelho.</p>
        </div>
      )}
      <ConfigForm wa={wa.data} onSaved={wa.reload} />
      <p className="text-xs text-muted-foreground">A conexão usa a Evolution API no seu próprio servidor. Evite disparos em massa para não ter o número bloqueado pelo WhatsApp.</p>
    </div>
  );
}
