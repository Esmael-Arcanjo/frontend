
import { useEffect, useState } from "react";
import {
  Boxes,
  Bot,
  CreditCard,
  FileSignature,
  Link2,
  LucideIcon,
  Mail,
  Megaphone,
  Receipt,
  Store,
  Users,
  UserSquare2,
} from "lucide-react";

import { fetchProducts, Product } from "../../services/catalog";
import { MenuGroup, NavDropdown } from "./NavDropdown";

const ICONS: Record<string, LucideIcon> = {
  link_bio: Link2,
  crm: Users,
  marketing: Megaphone,
  chatbot: Bot,
  erp: Boxes,
  rh: UserSquare2,
  assinatura_docs: FileSignature,
  recebimento: Receipt,
  email_api: Mail,
  payments_api: CreditCard,
  marketplace: Store,
};

const GROUPS: { title: string; keys: string[]; col: number }[] = [
  {
    title: "Vendas e presença digital",
    keys: ["link_bio", "crm", "marketing", "chatbot"],
    col: 0,
  },
  {
    title: "Gestão da empresa",
    keys: ["erp", "rh", "assinatura_docs", "recebimento"],
    col: 1,
  },
  {
    title: "APIs para desenvolvedores",
    keys: ["email_api", "payments_api", "marketplace"],
    col: 1,
  },
];

const toColumns = (products: Product[]): MenuGroup[][] => {
  const cols: MenuGroup[][] = [[], []];

  // Mantém somente produtos ativos
  const activeProducts = products.filter(
    (product) => product.status === "available"
  );

  GROUPS.forEach((group) => {
    const items = group.keys
      .map((key) => activeProducts.find((product) => product.key === key))
      .filter(Boolean)
      .map((product) => ({
        id: product!.key,
        label: product!.name,
        to: `/produtos/${product!.slug}`,
        hint: product!.tagline,
        icon: ICONS[product!.key] || Boxes,
      }));

    // Exibe o grupo somente se possuir produtos ativos
    if (items.length) {
      cols[group.col].push({
        title: group.title,
        items,
      });
    }
  });

  return cols;
};

export const ProductsMenu = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <NavDropdown
      label="Produtos"
      testId="nav-products"
      columns={toColumns(products)}
    />
  );
};
