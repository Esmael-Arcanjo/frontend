import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="flex items-center gap-2" data-testid="brand-logo">
    <img src="/images/Logotipo5.png"alt="Leamse Logo"className="h-40 w-auto object-contain"/>
  </Link>
);