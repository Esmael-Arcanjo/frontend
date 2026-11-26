import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const PublicFooter = () => (
  <footer className="public-footer-night relative w-full overflow-hidden border-t border-white/10 text-primary-foreground" data-testid="public-footer">
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
      <Logo light />
      <div className="flex flex-col gap-3 text-sm text-white sm:flex-row sm:items-center sm:gap-6">
        <nav className="flex gap-4" aria-label="Informações legais">
          <Link to="/termos" className="hover:underline">Termos de Uso</Link>
          <Link to="/privacidade" className="hover:underline">Privacidade</Link>
          <button
            type="button"
            className="hover:underline"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("leamse-open-cookie-preferences"),
              )
            }
          >
            Cookies
          </button>
        </nav>
        <p>© {new Date().getFullYear()} LEAMSE GESTAO.</p>
      </div>
    </div>
  </footer>
);
