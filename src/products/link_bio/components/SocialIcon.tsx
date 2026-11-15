import { IconType } from "react-icons";
import {
  FaBehance, FaDiscord, FaEnvelope, FaFacebook, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaPinterest, FaSnapchat,
  FaSpotify, FaTelegram, FaThreads, FaTiktok, FaTwitch, FaVideo, FaWhatsapp, FaXTwitter, FaYoutube,
} from "react-icons/fa6";

export const SOCIAL_ICONS: Record<string, IconType> = {
  instagram: FaInstagram, facebook: FaFacebook, x: FaXTwitter, tiktok: FaTiktok, youtube: FaYoutube, linkedin: FaLinkedin,
  whatsapp: FaWhatsapp, telegram: FaTelegram, pinterest: FaPinterest, threads: FaThreads, github: FaGithub, spotify: FaSpotify,
  twitch: FaTwitch, discord: FaDiscord, kwai: FaVideo, snapchat: FaSnapchat, behance: FaBehance, email: FaEnvelope, website: FaGlobe,
};

export const SocialIcon = ({ network, className = "h-5 w-5" }: { network: string; className?: string }) => {
  const Icon = (SOCIAL_ICONS[network] || FaGlobe) as unknown as React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  return <Icon className={className} aria-hidden />;
};
