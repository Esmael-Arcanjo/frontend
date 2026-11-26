import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const PublicFooter = () => (
  <footer className="w-full border-t border-border bg-[#5b21b6] text-white" data-testid="public-footer">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
      <Logo light />
      <div className="flex flex-col gap-3 text-sm text-white sm:flex-row sm:items-center sm:gap-6">
        <nav className="flex gap-4" aria-label="Informações legais">
          <Link to="/termos" className="hover:underline">Termos de Uso</Link>
          <Link to="/privacidade" className="hover:underline">Privacidade</Link>
        </nav>
        <p>© {new Date().getFullYear()} LEAMSE GESTAO.</p>
      </div>
    </div>
  </footer>
);
