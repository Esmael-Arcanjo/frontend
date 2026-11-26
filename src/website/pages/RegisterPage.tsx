import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/shared/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { safeNext } from "./LoginPage";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ name: "", email: "", document: "", password: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password, form.document);
      toast.success("Conta criada. Enviamos um link de verificação para o seu e-mail.");
      navigate(next);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grain h-auto min-h-screen w-full overflow-visible bg-surface md:h-dvh md:overflow-hidden" data-testid="auth-layout">
      <div className="grid h-auto min-h-screen w-full bg-card md:h-dvh md:grid-cols-2">
        <aside className="flex flex-col items-center justify-center bg-white px-8 py-10 text-center md:px-12">
          <Link to="/" aria-label="LEAMSE - página inicial" className="flex justify-center">
            <img src="/images/Logotipofavi.png" alt="Logo LEAMSE" className="h-52 w-52 object-contain sm:h-64 sm:w-64" />
          </Link>
          <h2 className="mt-8 font-display text-2xl font-extrabold tracking-tight">Bem-vindo à LEAMSE</h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Crie sua conta para contratar e acessar nossas soluções digitais.</p>
        </aside>
        <section className="flex items-start px-6 py-8 sm:px-10 md:h-dvh md:items-center md:overflow-hidden lg:px-14">
          <div className="mx-auto w-full max-w-md md:my-auto">
            <h1 className="font-display text-2xl font-extrabold tracking-tight" data-testid="auth-title">Criar conta</h1>
            <p className="mt-1 text-sm text-muted-foreground">Uma conta para contratar e acessar seus produtos.</p>
            <div className="mt-3 flex justify-end">
              <Button asChild variant="outline" size="sm" className="rounded-md" data-testid="register-to-login">
                <Link to={`/entrar?next=${encodeURIComponent(next)}`}>Já tenho conta</Link>
              </Button>
            </div>
            <form onSubmit={submit} className="mt-3 space-y-4" data-testid="register-form">
              <div className="space-y-2"><Label htmlFor="r-name">Nome completo</Label>
                <Input id="r-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="register-name" /></div>
              <div className="space-y-2"><Label htmlFor="r-email">E-mail</Label>
                <Input id="r-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="register-email" /></div>
              <div className="space-y-2"><Label htmlFor="r-doc">CPF ou CNPJ</Label>
                <Input id="r-doc" required inputMode="numeric" placeholder="000.000.000-00" value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} data-testid="register-document" /></div>
              <div className="space-y-2"><Label htmlFor="r-pass">Senha</Label>
                <PasswordInput id="r-pass" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="register-password" />
                <p className="text-xs text-muted-foreground">Mínimo de 10 caracteres, com letras e números.</p></div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  id="r-terms"
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                  data-testid="register-terms"
                />
                <div>
                  <label htmlFor="r-terms">Li e aceito os documentos:</label>{" "}
                  <Link to="/termos" className="font-semibold text-foreground underline">Termos de Uso</Link>
                  {" e "}
                  <Link to="/privacidade" className="font-semibold text-foreground underline">Política de Privacidade</Link>.
                </div>
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full" data-testid="register-submit">{busy ? "Criando..." : "Criar conta"}</Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
