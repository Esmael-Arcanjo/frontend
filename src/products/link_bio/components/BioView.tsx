import { Building2, MapPin } from "lucide-react";
import type { PublicBio } from "../types/bio";
import { SocialIcon } from "./SocialIcon";

const RADIUS = { rounded: "rounded-xl", pill: "rounded-full", square: "rounded-none" };
const initials = (n: string) => n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

type Props = { bio: PublicBio; onLinkClick?: (id: string) => void; onSocialClick?: (network: string) => void; compact?: boolean };

export const BioView = ({ bio, onLinkClick, onSocialClick, compact }: Props) => {
  const t = bio.theme;
  const company = bio.profile_type === "company";
  return (
    <div className={`flex w-full flex-col items-center px-5 ${compact ? "py-8" : "min-h-screen py-14"}`} style={{ background: t.background, color: t.text }} data-testid="bio-view">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className={`grid h-24 w-24 place-items-center overflow-hidden border-4 text-2xl font-extrabold ${company ? "rounded-2xl" : "rounded-full"}`} style={{ borderColor: t.accent, background: t.card }}>
          {bio.avatar ? <img src={bio.avatar} alt={bio.display_name} className="h-full w-full object-cover" /> : <span className="font-display">{initials(bio.display_name)}</span>}
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold" data-testid="bio-name">{bio.display_name}</h1>
        {company ? (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm opacity-80" data-testid="bio-type-company"><Building2 className="h-4 w-4" /> Empresa{bio.title ? ` · ${bio.title}` : ""}</p>
        ) : (
          bio.title && <p className="mt-1 text-sm font-semibold opacity-85" data-testid="bio-type-person">{bio.title}</p>
        )}
        {bio.description && <p className="mt-3 max-w-sm whitespace-pre-line text-sm opacity-80" data-testid="bio-description">{bio.description}</p>}
        {bio.location && (
          bio.show_map ? (
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bio.location)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs underline-offset-4 opacity-80 hover:underline" data-testid="bio-location"><MapPin className="h-3.5 w-3.5" /> {bio.location}</a>
          ) : <p className="mt-3 inline-flex items-center gap-1 text-xs opacity-80" data-testid="bio-location"><MapPin className="h-3.5 w-3.5" /> {bio.location}</p>
        )}
        {bio.socials.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2" data-testid="bio-socials">
            {bio.socials.map((s) => (
              <a key={s.network} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.network} onClick={() => onSocialClick?.(s.network)}
                className="grid h-10 w-10 place-items-center rounded-full transition-transform hover:-translate-y-0.5" style={{ background: t.card }} data-testid={`bio-social-${s.network}`}>
                <SocialIcon network={s.network} />
              </a>
            ))}
          </div>
        )}
        <div className="mt-7 w-full space-y-3" data-testid="bio-links">
          {bio.links.map((l) => (
            <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => onLinkClick?.(l.id)}
              className={`block w-full px-5 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${RADIUS[t.button_style]}`}
              style={{ background: t.accent, color: "#fff" }} data-testid={`bio-link-${l.id}`}>{l.title}</a>
          ))}
        </div>
        <a href="/produtos/link-bio" className="mt-10 text-[11px] uppercase tracking-widest opacity-50 hover:opacity-80" data-testid="bio-made-with">Feito com LEAMSE</a>
      </div>
    </div>
  );
};
