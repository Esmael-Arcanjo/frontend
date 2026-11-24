import { ReactNode } from "react";
import { PublicHeader } from "../components/PublicHeader";
import { PublicFooter } from "../components/PublicFooter";
import { Logo } from "../components/Logo";

export const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen w-full flex-col bg-background">
    <PublicHeader />
    <main className="w-full flex-1">{children}</main>
    <PublicFooter />
  </div>
);

export const AuthCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <div className="grain flex min-h-screen overflow-hidden w-full flex-col items-center justify-center gap-8 bg-surface px-4 py-12" data-testid="auth-layout">
    <Logo />
    <div className="fade-up w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-display text-2xl font-extrabold tracking-tight" data-testid="auth-title">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  </div>
);
