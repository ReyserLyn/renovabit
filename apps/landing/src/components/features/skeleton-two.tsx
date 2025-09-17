import {
  IconBolt,
  IconDeviceDesktop,
  IconKey,
  IconShield,
  IconWorld,
} from "@tabler/icons-react";

import { ImageCard } from "../common/image-card";
import type { Service } from "./types";

const SKELETON_TWO_CONFIG = {
  image: "/images/services/soporte-remoto.avif",
  alt: "Soporte técnico remoto usando RustDesk",
  description: "Soporte técnico desde cualquier lugar con total seguridad.",
};

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
      <ImageCard
        image={SKELETON_TWO_CONFIG.image}
        alt={SKELETON_TWO_CONFIG.alt}
        description={SKELETON_TWO_CONFIG.description}
        icon={IconWorld}
        iconSize={12}
        aspectRatio="square"
        width={224}
        height={224}
        containerClassName="w-[70%]"
        iconBgColor="bg-primary/90 text-primary-foreground"
      />

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
