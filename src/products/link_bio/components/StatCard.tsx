import { LucideIcon } from "lucide-react";

export const StatCard = ({ label, value, icon: Icon, testId }: { label: string; value: string | number; icon: LucideIcon; testId: string }) => (
  <div className="rounded-xl border border-border bg-card p-5" data-testid={testId}>
    <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-[color:var(--product)]" /></div>
    <p className="mt-3 font-display text-3xl font-extrabold">{value}</p>
  </div>
);
