import { Button } from "@renovabit/ui/src/components/ui/button";
import TitleSection from "./common/title-section";
import {
  FeatureCard,
  FeatureDescription,
  FeatureTitle,
} from "./features/feature-components";
import { featuresData } from "./features/features-data";

export function Features() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 max-w-7xl mx-auto">
      <TitleSection
        title="Servicios"
        subtitle="Te ofrecemos los mejores servicios"
        description="Reparamos tu laptop, mejoramos tu equipo y cuidamos tu inversión con
          la más alta calidad."
      />

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-border">
          {featuresData.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 mt-8">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Consultar por otro servicio
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Ver todos los servicios
        </Button>
      </div>
    </section>
  );
}
