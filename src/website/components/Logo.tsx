import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="flex items-center gap-2" data-testid="brand-logo">
    <img
      src="/images/Logotipo5.png"
      alt="LEAMSE"
      className={`h-14 w-40 shrink-0 -translate-x-8 object-cover object-center ${light ? "brightness-0 invert" : ""}`}
    />
  </Link>
);