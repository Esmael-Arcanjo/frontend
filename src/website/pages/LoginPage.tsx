import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/shared/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
export const safeNext = (value: string | null) => (value && value.startsWith("/") && !value.startsWith("//") ? value : "/minha-conta");

export default function LoginPage() {
  const { login, loginMfa } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [mfaToken, setMfaToken] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mfaToken) {
        await loginMfa(mfaToken, code);
        navigate("/minha-conta");
      } else {
        const r = await login(form.email, form.password);
        if (r.mfa_required) setMfaToken(r.mfa_token!); else navigate("/minha-conta");
      }
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grain fixed inset-0 h-dvh w-full touch-none overflow-hidden bg-surface" data-testid="auth-layout">
      <div className="grid h-dvh w-full grid-rows-[38dvh_62dvh] overflow-hidden bg-card md:grid-cols-2 md:grid-rows-1">
        <aside className="flex min-h-0 flex-col items-center justify-center bg-white px-8 py-4 text-center md:px-12 md:py-10">
          <Link to="/" aria-label="LEAMSE - página inicial" className="flex justify-center">
            <img src="/images/Logotipofavi.png" alt="Logo LEAMSE" className="h-32 w-32 object-contain sm:h-48 sm:w-48 md:h-52 md:w-52 lg:h-64 lg:w-64" />
          </Link>
          <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight md:mt-8 md:text-2xl">Bem-vindo à LEAMSE</h2>
        </aside>
        <section className="flex min-h-0 items-center overflow-hidden px-6 py-3 sm:px-10 md:py-8 lg:px-14">
          <div className="mx-auto w-full max-w-md md:my-auto">
            <h1 className="font-display text-2xl font-extrabold tracking-tight" data-testid="auth-title">{mfaToken ? "Verificação em dois fatores" : "Entrar"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{mfaToken ? "Digite o código do seu aplicativo autenticador." : "Acesse sua conta."}</p>
            <form onSubmit={submit} className="mt-6 space-y-4" data-testid="login-form">
              {mfaToken ? (
                <div className="space-y-2"><Label htmlFor="mfa">Código</Label>
                  <Input id="mfa" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={(e) => setCode(e.target.value)} data-testid="login-mfa-code" /></div>
              ) : (
                <>
                  <div className="space-y-2"><Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="login-email" /></div>
                  <div className="space-y-2"><Label htmlFor="password">Senha</Label>
                    <PasswordInput id="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="login-password" /></div>
                </>
              )}
              <Button type="submit" disabled={busy} className="w-full rounded-full" data-testid="login-submit">{busy ? "Entrando..." : mfaToken ? "Verificar" : "Entrar"}</Button>
            </form>
            {!mfaToken && (
              <div className="mt-5 flex justify-between text-sm">
                <Link to="/esqueci-senha" className="text-muted-foreground hover:text-foreground" data-testid="login-forgot">Esqueci minha senha</Link>
                <Link to={`/cadastro?next=${encodeURIComponent(next)}`} className="font-semibold" data-testid="login-to-register">Criar conta</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
