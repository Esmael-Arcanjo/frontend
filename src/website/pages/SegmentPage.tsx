import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { errMsg } from "@/shared/api/client";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProductCard } from "../components/ProductCard";
import { fetchProducts, fetchSegments, Product, Segment } from "../services/catalog";

export default function SegmentPage() {
  const { key = "" } = useParams();
  const [data, setData] = useState<{ segment?: Segment; products: Product[] } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([fetchSegments(), fetchProducts()])
      .then(([s, p]) => setData({ segment: s.find((x) => x.key === key), products: p.filter((x) => x.supported_segments.includes(key)) }))
      .catch((e) => setError(errMsg(e)));
  }, [key]);

  if (error) return <PublicLayout><div className="p-10"><ErrorState message={error} /></div></PublicLayout>;
  if (!data) return <PublicLayout><LoadingState /></PublicLayout>;
  if (!data.segment) return <PublicLayout><div className="p-10"><ErrorState message="Segmento não encontrado." /></div></PublicLayout>;
  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" data-testid="segment-page">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Segmento</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl" data-testid="segment-name">{data.segment.name}</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">Produtos já validados para {data.segment.name}. Ao contratar, campos, funis e modelos são configurados para este mercado.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.products.map((p, i) => <ProductCard key={p.key} product={p} index={i} />)}</div>
      </section>
    </PublicLayout>
  );
}
