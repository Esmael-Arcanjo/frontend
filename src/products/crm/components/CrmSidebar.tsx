import { NavLink } from "react-router-dom";
import { CalendarCheck, Contact, CreditCard, Globe, Handshake, History, LayoutDashboard, MessageCircle, Smartphone, SquareKanban, UserPlus, Users, Workflow } from "lucide-react";
import { BASE_PATH, PRODUCT_NAME } from "../utils/constants";
import type { NavItem } from "../types";

const NAV: NavItem[] = [
  { label: "Painel", to: "", icon: LayoutDashboard, testId: "crm-nav-dashboard" },
  { label: "Leads", to: "/leads", icon: UserPlus, testId: "crm-nav-leads" },
  { label: "Contatos", to: "/contatos", icon: Contact, testId: "crm-nav-contacts" },
  { label: "Conversas", to: "/conversas", icon: MessageCircle, testId: "crm-nav-conversations" },
  { label: "Oportunidades", to: "/oportunidades", icon: SquareKanban, testId: "crm-nav-opportunities" },
  { label: "Atividades", to: "/atividades", icon: CalendarCheck, testId: "crm-nav-activities" },
  { label: "Funil", to: "/funil", icon: Workflow, testId: "crm-nav-pipeline" },
  { label: "Equipe", to: "/equipe", icon: Users, testId: "crm-nav-team" },
  { label: "Assinatura", to: "/assinatura", icon: CreditCard, testId: "crm-nav-billing" },
  { label: "Histórico", to: "/historico", icon: History, testId: "crm-nav-audit" }
];
const INTEGRATIONS: NavItem[] = [
  { label: "WhatsApp", to: "/integracoes/whatsapp", icon: Smartphone, testId: "crm-nav-whatsapp" },
  { label: "Site", to: "/integracoes/site", icon: Globe, testId: "crm-nav-site" },
];

const Item = ({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) => (
  <NavLink to={`${BASE_PATH}${item.to}`} end={item.to === ""} onClick={onNavigate} data-testid={item.testId}
    className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
    <item.icon className="h-4 w-4" />
    {item.label}
  </NavLink>
);

export const CrmSidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
  <aside className="flex h-full w-64 flex-col border-r border-border bg-[hsl(var(--sidebar))]" data-testid="crm-sidebar">
    <div className="flex h-16 items-center gap-3 border-b border-border px-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: "#0F766E" }}>
        <Handshake className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-sm font-extrabold">CRM de Vendas</p>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">LEAMSE</p>
      </div>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV.map((item) => <Item key={item.to} item={item} onNavigate={onNavigate} />)}
      <p className="px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Integrações</p>
      {INTEGRATIONS.map((item) => <Item key={item.to} item={item} onNavigate={onNavigate} />)}
    </nav>
    <p className="border-t border-border p-4 text-[11px] text-muted-foreground">{PRODUCT_NAME} · v1</p>
  </aside>
);
