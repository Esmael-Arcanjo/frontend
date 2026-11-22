import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCrmApi } from "../services/crmApi";

type Note = { id: string; title: string; body: string; read: boolean; created_at: string };

const beep = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch { /* audio blocked until user interacts */ }
};

export const NotificationBell = () => {
  const api = useCrmApi();
  const [items, setItems] = useState<Note[]>([]);
  const seen = useRef<Set<string> | null>(null);
  const load = useCallback(async () => {
    try {
      const list: Note[] = await api.notifications();
      const fresh = seen.current ? list.filter((n) => !n.read && !seen.current!.has(n.id)) : [];
      if (fresh.length) { beep(); toast.info(fresh[0].title, { description: fresh[0].body }); }
      seen.current = new Set(list.map((n) => n.id));
      setItems(list);
    } catch { /* keep last list */ }
  }, [api]);
  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);
  const unread = items.filter((n) => !n.read).length;
  const markRead = async (n: Note) => {
    if (n.read) return;
    await api.readNotification(n.id).catch(() => undefined);
    setItems((all) => all.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-muted" aria-label="Notificações" data-testid="crm-notification-bell">
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground" data-testid="crm-notification-count">{unread}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 w-80 overflow-y-auto p-2" data-testid="crm-notification-panel">
        {items.length === 0 ? <p className="p-3 text-sm text-muted-foreground">Nenhuma notificação.</p> : items.slice(0, 20).map((n) => (
          <button key={n.id} type="button" onClick={() => markRead(n)} className={`block w-full rounded-lg p-3 text-left text-sm hover:bg-muted ${n.read ? "opacity-60" : ""}`} data-testid={`crm-notification-${n.id}`}>
            <p className="font-semibold">{n.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
