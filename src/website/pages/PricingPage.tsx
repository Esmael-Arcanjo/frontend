
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { errMsg } from "@/shared/api/client";
import { PublicLayout } from "../layouts/PublicLayout";
import { fetchPricing, formatPrice, PricedProduct } from "../services/catalog";

const ProductPricing = ({ product }: { product: PricedProduct }) => (
  <section
    className="rounded-2xl border border-border bg-card p-6"
    data-testid={`pricing-${product.key}`}
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-extrabold">
          {product.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {product.tagline}
        </p>
      </div>

      <Button asChild variant="outline" size="sm" className="rounded-full">
        <Link to={`/produtos/${product.slug}`}>
          Ver detalhes
        </Link>
      </Button>
    </div>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {product.plans.map((p) => (
        <div
          key={p.plan_key}
          className="flex flex-col rounded-xl border border-border p-5"
        >
          <p className="text-sm font-semibold">{p.name}</p>

          <p className="mt-2 font-display text-3xl font-extrabold">
            {formatPrice(p.price_cents, p.currency)}
            <span className="text-sm font-medium text-muted-foreground">
              {p.interval === "year" ? "/ano" : "/mês"}
            </span>
          </p>

          <ul className="mt-4 flex-1 space-y-2 text-sm">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {h}
              </li>
            ))}
          </ul>

          <Button asChild className="mt-5 rounded-full">
            <Link to={`/contratar/${product.slug}?plano=${p.plan_key}`}>
              Contratar
            </Link>
          </Button>
        </div>
      ))}
    </div>
  </section>
);

export default function PricingPage() {
  const [products, setProducts] = useState<PricedProduct[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPricing()
      .then(setProducts)
      .catch((e) => setError(errMsg(e)));
  }, []);

  const available = (products || []).filter(
    (p) => p.status === "available"
  );

  return (
    <PublicLayout>
      <div
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
        data-testid="pricing-page"
      >
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
          Preços
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Cada produto tem sua própria assinatura. Contratar um não libera os demais.
        </p>

        {error ? (
          <div className="mt-10">
            <ErrorState message={error} />
          </div>
        ) : !products ? (
          <LoadingState />
        ) : (
          <div className="mt-10 space-y-6">
            {available.map((p) => (
              <ProductPricing key={p.key} product={p} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
