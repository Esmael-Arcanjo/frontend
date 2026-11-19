import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="flex items-center gap-2" data-testid="brand-logo">
    <img src="/images/Logotipo4.png"alt="Leamse Logo"className="h-10 w-auto object-contain"/>
    <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : ""}`}>LEAMSE</span>
  </Link>
);