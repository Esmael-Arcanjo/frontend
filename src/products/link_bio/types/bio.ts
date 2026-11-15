export type Social = { network: string; url: string };
export type BioPage = {
  id: string; version: number; handle: string; profile_type: "person" | "company"; display_name: string;
  title: string | null; description: string | null; location: string | null; show_map: boolean;
  avatar: string | null; socials: Social[]; published: boolean; segment: string;
};
export type BioLink = { id: string; version: number; title: string; url: string; position: number; active: boolean; clicks: number };
export type Theme = { preset: string; accent: string; button_style: "rounded" | "pill" | "square"; name: string; background: string; text: string; card: string };
export type PublicBio = Omit<BioPage, "id" | "version" | "published" | "segment"> & { links: { id: string; title: string; url: string }[]; theme: Theme };
