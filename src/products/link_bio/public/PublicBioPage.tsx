import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, BACKEND_URL } from "@/shared/api/client";
import { LoadingState } from "@/shared/components/States";
import { BioView } from "../components/BioView";
import type { PublicBio } from "../types/bio";

export default function PublicBioPage() {
  const { handle = "" } = useParams();
  const [bio, setBio] = useState<PublicBio | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api.get(`/api/v1/public/bio/${handle}`).then((r) => { setBio(r.data); document.title = `${r.data.display_name} | LEAMSE`; }).catch(() => setMissing(true));
  }, [handle]);

  const track = (body: object) => {
    const url = `${BACKEND_URL}/api/v1/public/bio/${handle}/click`;
    const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
    if (!navigator.sendBeacon?.(url, blob)) fetch(url, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" }, keepalive: true });
  };

  if (missing) return <div className="grid min-h-screen place-items-center bg-surface p-6 text-center" data-testid="bio-not-found"><div><p className="font-display text-2xl font-extrabold">Página não encontrada</p><a href="/" className="mt-3 inline-block text-sm underline">leamse.com</a></div></div>;
  if (!bio) return <LoadingState />;
  return <BioView bio={bio} onLinkClick={(id) => track({ link_id: id })} onSocialClick={(n) => track({ network: n })} />;
}
