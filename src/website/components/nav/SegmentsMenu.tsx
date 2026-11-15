import { useEffect, useState } from "react";
import { BedDouble, Briefcase, GraduationCap, HeartPulse, LucideIcon, Scale, ShoppingBag, Sprout, Truck } from "lucide-react";
import { fetchSegments, Segment } from "../../services/catalog";
import { NavDropdown } from "./NavDropdown";

const META: Record<string, { icon: LucideIcon; hint: string }> = {
  saude: { icon: HeartPulse, hint: "Clínicas, consultórios e profissionais da saúde" },
  educacao: { icon: GraduationCap, hint: "Escolas, cursos e professores" },
  juridico: { icon: Scale, hint: "Escritórios de advocacia e consultorias" },
  servicos: { icon: Briefcase, hint: "Agências, consultores e prestadores" },
  comercio: { icon: ShoppingBag, hint: "Lojas físicas, varejo e e-commerce" },
  hotelaria: { icon: BedDouble, hint: "Hotéis, pousadas e hospedagens" },
  logistica: { icon: Truck, hint: "Transportadoras, entregas e armazéns" },
  agro: { icon: Sprout, hint: "Produtores, cooperativas e revendas" },
};
const LEFT = ["saude", "educacao", "juridico", "servicos"];

export const SegmentsMenu = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  useEffect(() => { fetchSegments().then(setSegments).catch(() => setSegments([])); }, []);
  const item = (s: Segment) => ({ id: s.key, label: s.name, to: `/segmentos/${s.key}`, icon: META[s.key]?.icon || Briefcase, hint: META[s.key]?.hint });
  const columns = [
    [{ title: "Serviços e profissionais", items: segments.filter((s) => LEFT.includes(s.key)).map(item) }],
    [{ title: "Comércio e operações", items: segments.filter((s) => !LEFT.includes(s.key)).map(item) }],
  ].filter((c) => c[0].items.length);
  return <NavDropdown label="Segmentos" testId="nav-segments" columns={columns} />;
};
