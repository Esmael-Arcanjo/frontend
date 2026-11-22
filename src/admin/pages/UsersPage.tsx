import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { ConfirmDialog } from "@/products/crm/components/ConfirmDialog";
import { AdminUser, adminApi } from "../adminApi";

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const load = useCallback(() => adminApi.users(q).then(setItems).catch((e) => setError(errMsg(e))), [q]);
  useEffect(() => { load(); }, [load]);
  const remove = async () => {
    if (!toDelete) return;
    try { await adminApi.deleteUser(toDelete.id); toast.success("Conta excluída"); load(); } catch (e) { toast.error(errMsg(e)); } finally { setToDelete(null); }
  };
  return (
    <div className="space-y-6" data-testid="admin-users">
      <PageTitle title="Usuários" subtitle={items ? `${items.length} contas` : ""} />
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por nome, e-mail ou CPF/CNPJ" value={q} onChange={(e) => setQ(e.target.value)} data-testid="admin-users-search" /></div>
      {error ? <ErrorState message={error} /> : !items ? <LoadingState /> : (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm" data-testid="admin-users-table">
            <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground"><tr><th className="p-4">Usuário</th><th className="p-4">CPF/CNPJ</th><th className="p-4">Produtos</th><th className="p-4">Criado em</th><th className="p-4" /></tr></thead>
            <tbody className="divide-y divide-border">
              {items.map((u) => (
                <tr key={u.id} data-testid={`admin-user-${u.id}`}>
                  <td className="p-4"><p className="font-semibold">{u.name} {u.is_admin && <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">admin</span>}</p><p className="text-xs text-muted-foreground">{u.email}</p></td>
                  <td className="p-4 font-mono text-xs">{u.document || "—"}</td>
                  <td className="p-4 text-xs">{u.products.map((p) => `${p.product_key} (${p.plan_key})`).join(", ") || "—"}</td>
                  <td className="p-4 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "—"}</td>
                  <td className="p-4 text-right">{!u.is_admin && <Button variant="ghost" size="icon" onClick={() => setToDelete(u)} data-testid={`admin-user-delete-${u.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={!!toDelete} title={`Excluir a conta de ${toDelete?.name}?`} description="As assinaturas serão canceladas e o acesso removido. Esta ação não pode ser desfeita." onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
