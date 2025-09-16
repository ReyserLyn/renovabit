import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import {
  IconBolt,
  IconDeviceDesktop,
  IconKey,
  IconShield,
  IconWorld,
} from "@tabler/icons-react";

import Image from "next/image";
import type { Service } from "./types";

export const SkeletonTwo = () => {
  const services: Service[] = [
    {
      icon: IconDeviceDesktop,
      label: "Instalación de programas",
      status: "Usamos RustDesk, su privacidad es nuestra prioridad.",
    },
    {
      icon: IconBolt,
      label: "Optimización de equipos",
      status: "Sacamos el máximo rendimiento de tu equipo.",
    },
    {
      icon: IconShield,
      label: "Protección antivirus",
      status: "Software oficial para proteger tu equipo.",
    },
    {
      icon: IconKey,
      label: "Activación de programas",
      status: "Activamos todo tipo deprogramas en cuestion de minutos.",
    },
  ];

  return (
    <div className="relative flex flex-col items-center p-5 gap-4 h-full overflow-hidden bg-gradient-to-br from-primary/8 via-secondary/5 to-accent/8 rounded-2xl border-2 border-primary/20 shadow-lg">
      <div className="relative w-[70%] mx-auto mb-2 rounded-2xl">
        <AspectRatio ratio={1 / 1} className="z-0">
          <Image
            src="/images/services/soporte.png"
            alt="Soporte técnico remoto"
            fill
            className="object-cover rounded-2xl"
          />
          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground rounded-full p-1 z-10">
            <IconWorld size={12} />
          </div>
        </AspectRatio>
      </div>

      <div className="w-full space-y-3">
        {services.map((service, idx) => {
          const IconComponent = service.icon;
          return (
            <div
              key={idx}
              className="group flex items-center gap-3 p-3 bg-gradient-to-r from-card to-card/90 rounded-xl shadow-sm border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md"
            >
              <div
                className={`p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform`}
              >
                <IconComponent size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-secondary-foreground">
                  {service.label}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {service.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
