import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialIcon } from "./SocialIcon";

export type SocialDraft = { network: string; value: string };
const PLACEHOLDER: Record<string, string> = { whatsapp: "5511999990000", email: "contato@empresa.com", website: "https://seusite.com" };

type Props = { networks: Record<string, string>; items: SocialDraft[]; onChange: (items: SocialDraft[]) => void; max?: number };

export const SocialsEditor = ({ networks, items, onChange, max }: Props) => {
  const used = new Set(items.map((i) => i.network));
  const limited = max !== undefined && items.length >= max;
  const free = limited ? [] : Object.keys(networks).filter((n) => !used.has(n));
  const update = (i: number, patch: Partial<SocialDraft>) => onChange(items.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="space-y-3" data-testid="bio-socials-editor">
      {items.map((s, i) => (
        <div key={s.network} className="flex items-center gap-2" data-testid={`bio-social-row-${s.network}`}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted"><SocialIcon network={s.network} /></span>
          <Input value={s.value} placeholder={PLACEHOLDER[s.network] || `Link do ${networks[s.network]}`} onChange={(e) => update(i, { value: e.target.value })} aria-label={networks[s.network]} data-testid={`bio-social-value-${s.network}`} />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))} data-testid={`bio-social-remove-${s.network}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      {limited && <p className="rounded-lg bg-secondary px-3 py-2 text-xs" data-testid="bio-socials-limit">Plano Grátis: até {max} redes sociais. <a href="/contratar/link-bio" className="font-semibold underline">Faça upgrade</a> para adicionar todas.</p>}
      {free.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {free.map((n) => (
            <button key={n} type="button" onClick={() => onChange([...items, { network: n, value: "" }])} title={`Adicionar ${networks[n]}`}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted" data-testid={`bio-social-add-${n}`}>
              <Plus className="h-3 w-3" /><SocialIcon network={n} className="h-3.5 w-3.5" />{networks[n]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
