import { NavLink } from "react-router-dom";
import { ChartColumn, CreditCard, IdCard, LayoutDashboard, Link2, Palette } from "lucide-react";
import { BASE_PATH, PRODUCT_NAME } from "../utils/constants";
import type { NavItem } from "../types";

const NAV: NavItem[] = [
  { label: "Painel", to: "", icon: LayoutDashboard, testId: "link-bio-nav-dashboard" },
  { label: "Minha página", to: "/pagina", icon: IdCard, testId: "link-bio-nav-page" },
  { label: "Links", to: "/links", icon: Link2, testId: "link-bio-nav-links" },
  { label: "Aparência", to: "/aparencia", icon: Palette, testId: "link-bio-nav-appearance" },
  { label: "Métricas", to: "/metricas", icon: ChartColumn, testId: "link-bio-nav-analytics" },
  { label: "Assinatura", to: "/assinatura", icon: CreditCard, testId: "link-bio-nav-billing" }
];

export const LinkBioSidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
  <aside className="flex h-full w-64 flex-col border-r border-border bg-[hsl(var(--sidebar))]" data-testid="link-bio-sidebar">
    <div className="flex h-16 items-center gap-3 border-b border-border px-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: "#6D28D9" }}>
        <Link2 className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-sm font-extrabold">Link na Bio</p>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">LEAMSE</p>
      </div>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV.map((item) => (
        <NavLink key={item.to} to={`${BASE_PATH}${item.to}`} end={item.to === ""} onClick={onNavigate} data-testid={item.testId}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
    <p className="border-t border-border p-4 text-[11px] text-muted-foreground">{PRODUCT_NAME} · v1</p>
  </aside>
);
