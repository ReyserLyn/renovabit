import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";

import Image from "next/image";

export default function Presentation() {
  return (
    <section className="text-center space-y-8 md:space-y-16 py-8 md:py-16 ">
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-sm md:text-base font-medium text-primary uppercase tracking-wider">
          Conócenos
        </h2>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
          RenovaBit
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Cónoce quienes somos y por qué somos tu mejor opción en Arequipa.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4">
        {/* Texto - 50% */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="max-w-lg">
            <span className="text-sm md:text-base lg:text-lg text-center lg:text-left">
              Somos un servicio técnico especializado en laptops y PCs, con foco
              en soluciones modernas como microsoldadura y upgrades. Tras años
              de estudio y experiencia, decidimos abrir Renovabit para dar
              soluciones reales a los problemas tecnológicos de hoy
            </span>
          </div>
        </div>

        {/* Cuadrado dividido en 4 - solo esquinas 1 y 4 - 50% */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Esquina 1 - Superior izquierda */}
            <div className="absolute top-0 left-0 w-36 h-36 md:w-44 md:h-44 z-10">
              <AspectRatio
                ratio={1}
                className="w-full h-full rounded-2xl shadow-lg"
              >
                <Image
                  src="/images/services/mantenimiento.webp"
                  alt="Servicio técnico"
                  fill
                  className="rounded-2xl object-cover"
                />
              </AspectRatio>
            </div>

            {/* Esquina 4 - Inferior derecha superpuesta */}
            <div className="absolute bottom-0 right-0 w-36 h-36 md:w-44 md:h-44 z-20">
              <AspectRatio
                ratio={1}
                className="w-full h-full rounded-2xl shadow-lg"
              >
                <Image
                  src="/images/services/reparacion.png"
                  alt="Servicio técnico"
                  fill
                  className="rounded-2xl object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
