import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";

type Conv = { contact_id: string; name: string; phone: string | null; last: string; at: string; direction: string };
type Msg = { id: string; direction: "in" | "out"; text: string; at: string };
const time = (iso: string) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const Thread = ({ contactId }: { contactId: string }) => {
  const api = useCrmApi();
  const [data, setData] = useState<{ contact: { name: string; phone: string | null }; items: Msg[] } | null>(null);
  const [text, setText] = useState("");
  const load = useCallback(() => api.conversation(contactId).then(setData).catch((e) => toast.error(errMsg(e))), [api, contactId]);
  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);
  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try { await api.sendMessage(contactId, text.trim()); setText(""); load(); } catch (err) { toast.error(errMsg(err)); }
  };
  if (!data) return <LoadingState />;
  return (
    <div className="flex h-[65vh] flex-col rounded-xl border border-border bg-card" data-testid="conversation-thread">
      <div className="border-b border-border p-4"><p className="font-semibold">{data.contact.name}</p><p className="text-xs text-muted-foreground">{data.contact.phone}</p></div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-surface p-4">
        {data.items.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.direction === "out" ? "ml-auto bg-primary text-primary-foreground" : "bg-card"}`} data-testid={`message-${m.id}`}>
            <p className="whitespace-pre-line">{m.text}</p><p className="mt-1 text-[10px] opacity-60">{time(m.at)}</p>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma resposta" data-testid="conversation-input" />
        <Button type="submit" className="rounded-full" data-testid="conversation-send"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
};

export default function ConversationsPage() {
  const api = useCrmApi();
  const list = useAsyncData<Conv[]>(useCallback(() => api.conversations(), [api]));
  const [active, setActive] = useState("");
  return (
    <div className="space-y-6" data-testid="crm-conversations-page">
      <PageTitle title="Conversas" subtitle="Mensagens do WhatsApp salvas no histórico de cada contato." />
      {list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !list.data ? <LoadingState /> : !list.data.length ? (
        <EmptyState title="Nenhuma conversa ainda" description="Conecte o WhatsApp em Integrações para receber mensagens aqui." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="space-y-1 rounded-xl border border-border bg-card p-2">
            {list.data.map((c) => (
              <button key={c.contact_id} type="button" onClick={() => setActive(c.contact_id)} className={`block w-full rounded-lg p-3 text-left transition-colors ${active === c.contact_id ? "bg-secondary" : "hover:bg-muted"}`} data-testid={`conversation-${c.contact_id}`}>
                <p className="flex justify-between text-sm font-semibold"><span className="truncate">{c.name}</span><span className="text-[10px] font-normal text-muted-foreground">{time(c.at)}</span></p>
                <p className="truncate text-xs text-muted-foreground">{c.direction === "out" ? "Você: " : ""}{c.last}</p>
              </button>
            ))}
          </div>
          {active ? <Thread key={active} contactId={active} /> : <EmptyState title="Selecione uma conversa" description="Escolha um contato para ver e responder." />}
        </div>
      )}
    </div>
  );
}
