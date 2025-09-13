import { AspectRatio } from "@renovabit/ui/components/ui/aspect-ratio";
import { Button } from "@renovabit/ui/components/ui/button";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Reparación de laptops",
    image: "/images/services/reparacion.png",
    features: ["Hardware", "BIOS", "Microsoldadura SMD"],
    isMiddle: false,
  },
  {
    id: 2,
    title: "Soporte técnico remoto",
    image: "/images/services/reparacion.png",
    features: [
      "Instalación de programas",
      "Optimización de equipos",
      "Antivirus",
    ],
    isMiddle: true,
  },
  {
    id: 3,
    title: "Mantenimiento y mejoras",
    image: "/images/services/reparacion.png",
    features: ["Cambio SSD", "Cambio de memoria RAM", "Limpieza profunda"],
    isMiddle: false,
  },
];

export default function Services() {
  return (
    <section className="text-center space-y-8 md:space-y-16 py-8 md:py-16">
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-sm md:text-base font-medium text-primary uppercase tracking-wider">
          Servicios
        </h2>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Te ofrecemos los mejores servicios
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Reparamos tu laptop, mejoramos tu equipo y cuidamos tu inversión con
          la más alta calidad.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 lg:gap-16 px-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex flex-col items-center gap-4 md:gap-6 ${
              !service.isMiddle ? "mt-16" : ""
            }`}
          >
            <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
              <AspectRatio
                ratio={1}
                className="bg-gradient-to-br from-muted to-muted/50 rounded-3xl shadow-lg"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="rounded-3xl object-cover"
                />
              </AspectRatio>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary">
                {service.title}
              </h3>
              <ul className="text-sm md:text-base text-foreground space-y-1">
                {service.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
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
