import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { fetchProducts, Product } from "@/website/services/catalog";
import { NativeSelect } from "@/products/crm/components/FormField";
import { adminApi } from "../adminApi";

export default function GrantPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ email: "", product_key: "link_bio", days: "30" });
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetchProducts().then((p) => setProducts(p.filter((x) => x.status === "available"))).catch(() => undefined); }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await adminApi.grant({ ...form, days: Number(form.days) }); toast.success("Plano liberado"); setForm({ ...form, email: "" }); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <div className="max-w-xl space-y-6" data-testid="admin-grant">
      <PageTitle title="Liberar plano grátis" subtitle="Dá acesso completo a um produto por um período, sem cobrança." />
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2"><Label htmlFor="g-email">E-mail da conta</Label><Input id="g-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="admin-grant-email" /></div>
        <div className="space-y-2"><Label htmlFor="g-product">Produto</Label>
          <NativeSelect id="g-product" value={form.product_key} onChange={(e) => setForm({ ...form, product_key: e.target.value })} data-testid="admin-grant-product">
            {products.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
          </NativeSelect></div>
        <div className="space-y-2"><Label htmlFor="g-days">Dias de acesso</Label><Input id="g-days" type="number" min={1} max={3650} required value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} data-testid="admin-grant-days" /></div>
        <Button type="submit" disabled={busy} className="rounded-full" data-testid="admin-grant-submit">{busy ? "Liberando..." : "Liberar plano"}</Button>
      </form>
    </div>
  );
}
