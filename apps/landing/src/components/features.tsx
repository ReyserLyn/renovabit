import { Button } from "@renovabit/ui/src/components/ui/button";
import {
  FeatureCard,
  FeatureDescription,
  FeatureTitle,
} from "./features/feature-components";
import { featuresData } from "./features/features-data";

export function Features() {
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8 text-center">
        <h2 className="text-sm md:text-base font-medium text-primary uppercase tracking-wider">
          Servicios
        </h2>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Te ofrecemos los mejores servicios
        </h1>

        <p className="text-sm md:text-base my-4 lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Reparamos tu laptop, mejoramos tu equipo y cuidamos tu inversión con
          la más alta calidad.
        </p>
      </div>

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
    </div>
  );
}
