
import { PublicLayout } from "../layouts/PublicLayout";
import { InfoSections } from "../components/HomeInfoSections";

const Hero = () => (
  <section
    className="w-full bg-[#5b21b6] text-white"
    data-testid="hero-section"
  >
    <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <h1
        className="fade-up mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
        style={{ animationDelay: "80ms" }}
      >
       O seu negócio cresce mais com {" "}
        <span className="text-secondary">
          Leamse | Soluções em Tecnologia
        </span>
      </h1>

      <p
        className="fade-up mt-6 max-w-xl text-base text-white/80 md:text-lg"
        style={{ animationDelay: "160ms" }}
      >
       Inovação e excelência em tecnologia. Transforme o seu negócio com nossas soluções digitais.
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
