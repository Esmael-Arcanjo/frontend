
import { PublicLayout } from "../layouts/PublicLayout";
import { InfoSections } from "../components/HomeInfoSections";

const Hero = () => (
  <section
    className="w-full bg-primary text-primary-foreground"
    data-testid="hero-section"
  >
    <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <h1
        className="fade-up mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
        style={{ animationDelay: "80ms" }}
      >
        Compre e venda com{" "}
        <span className="text-secondary">
          quem está perto de você.
        </span>
      </h1>

      <p
        className="fade-up mt-6 max-w-xl text-base text-primary-foreground/80 md:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        Publique o que você quer vender ou conte o que procura.
        Nossa equipe responde pelo WhatsApp.
      </p>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <InfoSections />
    </PublicLayout>
  );
}
