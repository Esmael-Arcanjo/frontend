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
        <div className="relative -mx-5 -mt-8 w-[calc(100%+2.5rem)] overflow-hidden sm:mx-0 sm:mt-0 sm:w-full sm:rounded-[2rem] sm:shadow-2xl" style={{ aspectRatio: "4 / 5", background: `linear-gradient(160deg, ${t.card}, ${t.accent})` }} data-testid="bio-hero-card">
          {bio.avatar ? <img src={bio.avatar} alt={bio.display_name} className="absolute inset-0 h-full w-full object-cover" data-testid="bio-avatar" />
            : <span className="absolute inset-0 grid place-items-center pb-24 font-display text-6xl font-extrabold text-white/80">{initials(bio.display_name)}</span>}
          <div className="absolute inset-x-0 bottom-0 h-3/4" style={{ background: `linear-gradient(to bottom, transparent, ${t.accent}e6 70%, ${t.accent})` }} />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-6 text-white">
            <h1 className="font-display text-3xl font-extrabold leading-tight drop-shadow" data-testid="bio-name">{bio.display_name}</h1>
            {company ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold opacity-90" data-testid="bio-type-company"><Building2 className="h-3.5 w-3.5" /> Empresa{bio.title ? ` · ${bio.title}` : ""}</p>
            ) : (
              bio.title && <p className="mt-1 text-xs font-semibold opacity-90" data-testid="bio-type-person">{bio.title}</p>
            )}
            {bio.description && <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs opacity-90" data-testid="bio-description">{bio.description}</p>}
            {bio.socials.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-3" data-testid="bio-socials">
                {bio.socials.map((s) => (
                  <a key={s.network} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.network} onClick={() => onSocialClick?.(s.network)}
                    className="text-white transition-transform hover:-translate-y-0.5" data-testid={`bio-social-${s.network}`}>
                    <SocialIcon network={s.network} className="h-6 w-6" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        {bio.location && (
          bio.show_map ? (
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bio.location)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs underline-offset-4 opacity-80 hover:underline" data-testid="bio-location"><MapPin className="h-3.5 w-3.5" /> {bio.location}</a>
          ) : <p className="mt-3 inline-flex items-center gap-1 text-xs opacity-80" data-testid="Publicadabio-location"><MapPin className="h-3.5 w-3.5" /> {bio.location}</p>
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
