import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const COOKIE_NAME = "leamse_cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readConsent = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
};

const saveConsent = (value: "necessary" | "all") => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; ` +
    `Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent("leamse-cookie-consent", { detail: value }));
};

export const CookieConsent = () => {
  const [open, setOpen] = useState(() => !readConsent());

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("leamse-open-cookie-preferences", handleOpen);
    return () =>
      window.removeEventListener("leamse-open-cookie-preferences", handleOpen);
  }, []);

  if (!open) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-3xl rounded-xl border border-white/10 bg-[#050505] p-4 text-white shadow-2xl sm:left-auto sm:right-5 sm:mx-0 sm:w-[390px]"
      data-testid="cookie-consent"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 id="cookie-consent-title" className="text-sm font-bold">
            Cookies e sua privacidade
          </h2>
          <p className="mt-1 text-sm leading-5 text-white/70">
            Usamos cookies essenciais para manter sua conta segura e, com sua
            autorização, cookies opcionais para melhorar a experiência.{" "}
            <Link
              to="/privacidade#cookies"
              className="font-semibold text-white underline underline-offset-2"
              onClick={() => setOpen(false)}
            >
              Saiba mais
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="h-10 rounded-lg border border-white/20 bg-transparent px-3 text-sm font-semibold transition-colors hover:bg-white/10"
          onClick={() => {
            saveConsent("necessary");
            setOpen(false);
          }}
        >
          Apenas essenciais
        </button>
        <button
          type="button"
          className="h-10 rounded-lg bg-white px-3 text-sm font-bold text-black transition-colors hover:bg-white/90"
          onClick={() => {
            saveConsent("all");
            setOpen(false);
          }}
        >
          Aceitar todos
        </button>
      </div>
    </aside>
  );
};
