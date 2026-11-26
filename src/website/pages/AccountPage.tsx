import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bell,
  Boxes,
  Bot,
  CreditCard,
  FileSignature,
  HelpCircle,
  Link2,
  LogOut,
  LucideIcon,
  Mail,
  MailWarning,
  Megaphone,
  Menu,
  MonitorSmartphone,
  Plus,
  Receipt,
  Settings,
  ShieldCheck,
  Store,
  User,
  Users,
  UserSquare2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { mySubscriptions } from "../services/billing";
import { Logo } from "../components/Logo";

type Sub = Awaited<ReturnType<typeof mySubscriptions>>["subscriptions"][number];

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  link_bio: Link2,
  crm: Users,
  marketing: Megaphone,
  chatbot: Bot,
  erp: Boxes,
  rh: UserSquare2,
  assinatura_docs: FileSignature,
  recebimento: Receipt,
  email_api: Mail,
  payments_api: CreditCard,
  marketplace: Store,
};
const ACCOUNT_MENU = [
  { label: "Meu Perfil", path: "/perfil", icon: User },
  { label: "Configurações", path: "/configuracoes", icon: Settings },
  { label: "Segurança", path: "/seguranca", icon: ShieldCheck },
  { label: "Sessões Ativas", path: "/sessoes", icon: MonitorSmartphone },
  { label: "Notificações", path: "/notificacoes", icon: Bell },
  { label: "Ajuda e Suporte", path: "/ajuda", icon: HelpCircle },
];
const PRODUCT_MENU_ITEMS: Record<string, { label: string; path: string }[]> = {
  link_bio: [
    { label: "Painel", path: "" },
    { label: "Minha página", path: "/pagina" },
    { label: "Links", path: "/links" },
    { label: "Aparência", path: "/aparencia" },
    { label: "Métricas", path: "/metricas" },
    { label: "Assinatura", path: "/assinatura" },
  ],
  crm: [
    { label: "Painel", path: "" },
    { label: "Leads", path: "/leads" },
    { label: "Contatos", path: "/contatos" },
    { label: "Conversas", path: "/conversas" },
    { label: "Oportunidades", path: "/oportunidades" },
    { label: "Atividades", path: "/atividades" },
    { label: "Funil", path: "/funil" },
    { label: "Equipe", path: "/equipe" },
    { label: "Assinatura", path: "/assinatura" },
    { label: "Histórico", path: "/historico" },
    { label: "WhatsApp", path: "/integracoes/whatsapp" },
    { label: "Site", path: "/integracoes/site" },
  ],
};

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [error, setError] = useState("");
  const productFrameRef = useRef<HTMLIFrameElement>(null);
  const frameSelectionRef = useRef("");
  const selectedProductKey = searchParams.get("product");
  const selectedOrganizationId = searchParams.get("organization_id");
  const requestedPagePath = searchParams.get("page") || "";
  const selectedProduct = useMemo(
    () => subs?.find((subscription) =>
      subscription.product_key === selectedProductKey &&
      (!selectedOrganizationId || subscription.organization_id === selectedOrganizationId)
    ) ?? null,
    [selectedOrganizationId, selectedProductKey, subs],
  );
  const allowedPagePaths = useMemo(() => {
    if (!selectedProduct) return new Set<string>();
    return new Set([
      "",
      ...ACCOUNT_MENU.map((item) => item.path),
      ...(PRODUCT_MENU_ITEMS[selectedProduct.product_key] || []).map((item) => item.path),
    ]);
  }, [selectedProduct]);
  const selectedPagePath = allowedPagePaths.has(requestedPagePath) ? requestedPagePath : "";
  const nameParts = user?.name.trim().split(/\s+/).filter(Boolean) ?? [];
  const headerName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : nameParts[0] || "";
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  const selectProduct = (subscription: Sub | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!subscription) {
      nextParams.delete("product");
      nextParams.delete("organization_id");
      nextParams.delete("page");
    } else {
      localStorage.setItem(`leamse:org:${subscription.product_key}`, subscription.organization_id);
      nextParams.set("product", subscription.product_key);
      nextParams.set("organization_id", subscription.organization_id);
      nextParams.delete("page");
    }
    setSearchParams(nextParams, { replace: true });
  };
  const setSelectedPagePath = (path: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (path) nextParams.set("page", path);
    else nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  };
  const openAccountPage = (path: string) => {
    const targetProduct = selectedProduct || subs?.[0];
    if (!targetProduct) return;
    localStorage.setItem(`leamse:org:${targetProduct.product_key}`, targetProduct.organization_id);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("product", targetProduct.product_key);
    nextParams.set("organization_id", targetProduct.organization_id);
    if (path) nextParams.set("page", path);
    else nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  };
  const sendProductNavigation = useCallback(() => {
    if (!selectedProduct) return;
    productFrameRef.current?.contentWindow?.postMessage(
      { type: "LEAMSE_ACCOUNT_NAVIGATE", path: `/${selectedProduct.slug}${selectedPagePath}` },
      window.location.origin,
    );
  }, [selectedPagePath, selectedProduct]);
  useEffect(() => {
    if (selectedProduct) {
      localStorage.setItem(`leamse:org:${selectedProduct.product_key}`, selectedProduct.organization_id);
    }
  }, [selectedProduct]);
  useEffect(() => {
    sendProductNavigation();
  }, [sendProductNavigation]);
  useEffect(() => {
    if (!selectedProduct) return;
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== productFrameRef.current?.contentWindow) return;
      const message = event.data;
      if (typeof message !== "object" || message === null || !("type" in message) || !("path" in message)) return;
      if (message.type !== "LEAMSE_PRODUCT_NAVIGATED" || typeof message.path !== "string") return;
      const target = new URL(message.path, window.location.origin);
      const basePath = `/${selectedProduct.slug}`;
      if (target.origin !== window.location.origin || (target.pathname !== basePath && !target.pathname.startsWith(`${basePath}/`))) return;
      const pagePath = target.pathname.slice(basePath.length);
      if (!allowedPagePaths.has(pagePath)) return;
      const frameSelection = `${selectedProduct.slug}-${selectedProduct.organization_id}`;
      const isInitialFrameNavigation = frameSelectionRef.current !== frameSelection;
      if (isInitialFrameNavigation) {
        frameSelectionRef.current = frameSelection;
      }
      if (isInitialFrameNavigation && pagePath !== selectedPagePath) {
        sendProductNavigation();
        return;
      }
      if (pagePath === selectedPagePath) return;
      const nextParams = new URLSearchParams(searchParams);
      if (pagePath) nextParams.set("page", pagePath);
      else nextParams.delete("page");
      setSearchParams(nextParams, { replace: true });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [allowedPagePaths, searchParams, selectedPagePath, selectedProduct, sendProductNavigation, setSearchParams]);
  useEffect(() => { if (user) mySubscriptions().then((d) => setSubs(d.subscriptions.filter((s) => s.status === "active" || s.status === "past_due"))).catch((e) => setError(errMsg(e))); }, [user]);

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/entrar?next=/minha-conta" replace />;
  if (user.is_admin) return <Navigate to="/admin" replace />;
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur-xl sm:gap-4 sm:px-6" data-testid="account-header">
        <Logo />
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1 sm:px-2">
          {selectedProduct && (
            <div className="hidden min-w-0 items-center gap-3 lg:flex" data-testid="account-selected-product-context">
              <span className="inline-flex h-8 shrink-0 items-center rounded-md bg-primary px-2.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">{selectedProduct.segment_name}</span>
              <span className="max-w-40 truncate text-sm text-muted-foreground">EMPRESA: <b className="text-foreground">{selectedProduct.organization_name}</b></span>
            </div>
          )}
          {!user.email_verified && (
            <div title="Confirme seu e-mail" className="flex h-8 w-8 shrink-0 items-center justify-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-1 text-xs sm:w-auto sm:px-2.5" data-testid="account-email-verification-header">
              <MailWarning className="h-4 w-4 shrink-0" />
              <span className="hidden truncate sm:inline">Confirme seu e-mail{selectedProduct ? "" : `: ${user.email}`}</span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Button asChild size="sm" className="h-8 rounded-md" data-testid="account-add-product">
            <Link to="/precos"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Assinar mais</span><span className="sm:hidden">Assinar</span></Link>
          </Button>
          {user.is_admin && <Button asChild variant="ghost" size="sm" className="hidden rounded-md sm:inline-flex"><Link to="/admin" data-testid="account-admin-header">Painel admin</Link></Button>}
          <span className="hidden max-w-[24vw] truncate text-xs font-semibold sm:inline sm:max-w-none sm:text-sm" data-testid="account-header-name">{headerName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm font-bold text-background" aria-label="Abrir menu do perfil" data-testid="account-profile">
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ACCOUNT_MENU.map((item) => (
                <DropdownMenuItem key={item.path} onSelect={() => openAccountPage(item.path)} className="cursor-pointer focus:bg-muted focus:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground" data-testid={`account-profile-${item.path.slice(1)}`}>
                  <item.icon className="mr-2 h-4 w-4" />{item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={async () => { await logout(); navigate("/"); }} className="cursor-pointer text-destructive" data-testid="account-header-logout">
                <LogOut className="mr-2 h-4 w-4" />Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row" data-testid="account-page">
        <aside className="flex shrink-0 flex-col items-stretch border-b border-border bg-card md:sticky md:top-16 md:h-[calc(100dvh-4rem)] md:self-start md:flex-row md:items-start md:border-b-0 md:border-r" aria-label="Produtos ativos" data-testid="account-products-sidebar">
          <nav className="flex w-full flex-row items-center gap-2 overflow-x-auto p-3 md:w-16 md:flex-col md:items-center md:overflow-x-visible" aria-label="Selecionar produto">
            {!error && subs?.map((subscription) => {
              const productId = `${subscription.product_key}-${subscription.organization_id}`;
              const ProductIcon = PRODUCT_ICONS[subscription.product_key] || Boxes;
              const isSelected = selectedProductKey === subscription.product_key && selectedOrganizationId === subscription.organization_id;
              return (
                <button
                  key={productId}
                  type="button"
                  title={subscription.product_name}
                  aria-label={`Abrir menu de ${subscription.product_name}`}
                  aria-expanded={selectedProduct === subscription}
                  onClick={() => {
                    selectProduct(isSelected ? null : subscription);
                  }}
                  className={`grid h-11 w-11 shrink-0 place-items-center border ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"}`}
                  data-testid={`account-product-${subscription.product_key}`}
                >
                  <ProductIcon className="h-5 w-5" />
                </button>
              );
            })}
          </nav>
        </aside>
        <main className={`min-w-0 flex-1 ${selectedProduct ? "p-0" : "px-4 py-8 sm:px-6 md:px-10 md:py-10"}`}>
          {selectedProduct ? (
            <iframe
              ref={productFrameRef}
              key={`${selectedProduct.slug}-${selectedProduct.organization_id}`}
              src={`/${selectedProduct.slug}`}
              title={`${selectedProduct.product_name} — painel`}
              className="h-[calc(100dvh-8.25rem)] w-full border-0 md:h-[calc(100dvh-4rem)]"
              onLoad={(event) => {
                const frameDocument = event.currentTarget.contentDocument;
                if (frameDocument && !frameDocument.getElementById("account-embedded-header-style")) {
                  const style = frameDocument.createElement("style");
                  style.id = "account-embedded-header-style";
                  style.textContent = `
                  header[data-testid$="-header"] { display: none !important; }
                  html, body, #root {
                    height: 100% !important;
                    min-height: 0 !important;
                    overflow: hidden !important;
                  }
                  [data-testid$="-layout"] {
                    height: 100% !important;
                    min-height: 0 !important;
                    overflow: hidden !important;
                  }
                  [data-testid$="-layout"] > div:first-child {
                    position: sticky !important;
                    top: 0 !important;
                    height: 100% !important;
                    flex-shrink: 0 !important;
                  }
                  [data-testid$="-layout"] > div:first-child > aside {
                    height: 100% !important;
                  }
                  [data-testid$="-layout"] > div:last-child {
                    height: 100% !important;
                    min-height: 0 !important;
                    overflow-y: auto !important;
                  }
                  @media (max-width: 1023px) {
                    html, body, #root {
                      height: auto !important;
                      min-height: 100% !important;
                      overflow-x: hidden !important;
                      overflow-y: auto !important;
                    }
                    [data-testid$="-layout"] {
                      flex-direction: column !important;
                      height: auto !important;
                      min-height: 100% !important;
                      overflow: visible !important;
                    }
                    [data-testid$="-layout"] > div:first-child {
                      display: none !important;
                      position: static !important;
                      height: auto !important;
                      width: 100% !important;
                    }
                    [data-testid$="-layout"] > div:last-child {
                      min-width: 0 !important;
                      width: 100% !important;
                      height: auto !important;
                      overflow: visible !important;
                    }
                    [data-testid$="-sidebar"] {
                      display: none !important;
                      height: auto !important;
                      width: 100% !important;
                      border-right: 0 !important;
                      border-bottom: 1px solid hsl(var(--border)) !important;
                    }
                    [data-testid$="-sidebar"] > div:first-child,
                    [data-testid$="-sidebar"] > p {
                      display: none !important;
                    }
                    [data-testid$="-sidebar"] > nav {
                      display: flex !important;
                      flex-direction: column !important;
                      align-items: stretch !important;
                      gap: 0.25rem !important;
                      max-height: 50dvh !important;
                      overflow-x: hidden !important;
                      overflow-y: auto !important;
                      padding: 0.5rem !important;
                    }
                    [data-testid$="-sidebar"] > nav > a {
                      flex-shrink: 0 !important;
                      white-space: nowrap !important;
                    }
                    [data-testid$="-sidebar"] > nav > a {
                      justify-content: flex-start !important;
                    }
                  }
                `;
                  frameDocument.head.appendChild(style);
                }
                sendProductNavigation();
              }}
              data-testid="account-product-panel"
            />
          ) : (
            <div className="mx-auto w-full max-w-5xl space-y-8" data-testid="account-content">
              <div>
                <h1 className="font-display text-3xl font-extrabold">Seus produtos</h1>
                <p className="mt-1 text-sm text-muted-foreground">Selecione um produto para abrir o painel e suas opções.</p>
              </div>
              {error ? <ErrorState message={error} /> : !subs ? <LoadingState /> : subs.length === 0 ? (
                <EmptyState title="Nenhum produto ativo" description="Escolha um produto para começar." action={<Button asChild className="rounded-full"><Link to="/precos" data-testid="account-browse">Ver produtos e preços</Link></Button>} />
              ) : null}
            </div>
          )}
        </main>
      </div>
      {selectedProduct && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center border border-primary bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground lg:hidden" aria-label="Abrir menu do produto" data-testid="account-product-menu-toggle">
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={8} className="mb-1 w-64" data-testid="account-product-menu">
            <DropdownMenuLabel className="truncate">{selectedProduct.product_name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(PRODUCT_MENU_ITEMS[selectedProduct.product_key] || [{ label: "Painel", path: "" }]).map((item) => (
              <DropdownMenuItem
                key={item.path}
                onSelect={() => setSelectedPagePath(item.path)}
                className="cursor-pointer focus:bg-muted focus:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
                data-testid={`account-product-page-${selectedProduct.product_key}-${item.path || "dashboard"}`}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
