import { useEffect, useState } from "react";
import { Boxes, Bot, CreditCard, FileSignature, Link2, LucideIcon, Mail, Megaphone, Receipt, Store, Users, UserSquare2 } from "lucide-react";
import { fetchProducts, Product } from "../../services/catalog";
import { MenuGroup, NavDropdown } from "./NavDropdown";

const ICONS: Record<string, LucideIcon> = {
  link_bio: Link2, crm: Users, marketing: Megaphone, chatbot: Bot, erp: Boxes, rh: UserSquare2,
  assinatura_docs: FileSignature, recebimento: Receipt, email_api: Mail, payments_api: CreditCard, marketplace: Store,
};
const GROUPS: { title: string; keys: string[]; col: number }[] = [
  { title: "Vendas e presença digital", keys: ["link_bio", "crm", "marketing", "chatbot"], col: 0 },
  { title: "Gestão da empresa", keys: ["erp", "rh", "assinatura_docs", "recebimento"], col: 1 },
  { title: "APIs para desenvolvedores", keys: ["email_api", "payments_api", "marketplace"], col: 1 },
];

const toColumns = (products: Product[]): MenuGroup[][] => {
  const cols: MenuGroup[][] = [[], []];
  GROUPS.forEach((g) => {
    const items = g.keys.map((k) => products.find((p) => p.key === k)).filter(Boolean).map((p) => ({
      id: p!.key, label: p!.name, to: `/produtos/${p!.slug}`, hint: p!.tagline, icon: ICONS[p!.key] || Boxes,
      badge: p!.status === "available" ? undefined : "Em breve",
    }));
    if (items.length) cols[g.col].push({ title: g.title, items });
  });
  return cols;
};

export const ProductsMenu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetchProducts().then(setProducts).catch(() => setProducts([])); }, []);
  return <NavDropdown label="Produtos" testId="nav-products" columns={toColumns(products)} />;
};
