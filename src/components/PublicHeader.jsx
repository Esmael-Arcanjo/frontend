import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

/** Shared public header used across Landing / Serviços / Sobre / Planos / Contato. */
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const link = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" data-testid="public-brand"><Logo /></Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/servicos" className={link} data-testid="nav-services">Serviços</NavLink>
          <NavLink to="/sobre" className={link} data-testid="nav-about">Sobre nós</NavLink>
          <NavLink to="/planos" className={link} data-testid="nav-plans">Planos</NavLink>
          <NavLink to="/contato" className={link} data-testid="nav-contact">Contato</NavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/login" data-testid="landing-login-btn">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/register" data-testid="landing-register-btn">Criar conta</Link>
          </Button>
        </div>

        <button onClick={() => setOpen(!open)} data-testid="public-nav-toggle"
                aria-label="Abrir menu"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-card md:hidden" data-testid="public-nav-mobile">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {[
              ["/servicos", "Serviços"],
              ["/sobre", "Sobre nós"],
              ["/planos", "Planos"],
              ["/contato", "Contato"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to}
                       className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-medium ${
                         isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                       }`}>{label}</NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/register">Criar conta</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <Logo size={26} />
        <nav className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
          <Link to="/servicos">Serviços</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/planos">Planos</Link>
          <Link to="/contato">Contato</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© 2026 LEAMSE · leamse.com</p>
      </div>
    </footer>
  );
}
