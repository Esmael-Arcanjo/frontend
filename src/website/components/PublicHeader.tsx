import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ProductsMenu } from "./nav/ProductsMenu";
import { SegmentsMenu } from "./nav/SegmentsMenu";
import { SecurityMenu } from "./nav/SecurityMenu";
import { CompanyMenu } from "./nav/CompanyMenu";

const PricingLink = () => (
  <NavLink to="/precos" className={({ isActive }) => `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:opacity-70 ${isActive ? "opacity-100" : "opacity-80"}`} data-testid="nav-pricing">Preços</NavLink>
);

export const PublicHeader = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background text-foreground" data-testid="public-header">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" data-testid="public-nav">
          <ProductsMenu /><SegmentsMenu /><SecurityMenu /><CompanyMenu /><PricingLink />
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="rounded-md"><Link to="/minha-conta" data-testid="nav-account">Minha conta</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-foreground hover:bg-black/5 hover:text-foreground"><Link to="/entrar" data-testid="nav-login">Entrar</Link></Button>
              <Button asChild size="sm" className="rounded-md bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/precos" data-testid="nav-contact">Planos</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
