import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import {
  IconBulb,
  IconDatabase,
  IconSearch,
  IconTool,
} from "@tabler/icons-react";
import { Monitor, Zap } from "lucide-react";
import Image from "next/image";
import type { Problem } from "./types";

const SKELETON_THREE_CONFIG = {
  image: "/images/services/mantenimiento.webp",
  alt: "Mantenimiento y mejoras",
  description:
    "Diagnóstico profesional para identificar y solucionar cualquier problema técnico.",
};

export const SkeletonThree = () => {
  const problems: Problem[] = [
    {
      issue: "¿Tu equipo demora en encender?",
      solution:
        "Actualiza a un SSD y notarás los cambios en el primer arranque.",
      icon: Zap,
    },
    {
      issue: "¿Abres un programa y se congela tu equipo?",
      solution: "Aumentamos tu memoria RAM para que abras más programas.",
      icon: IconDatabase,
    },
    {
      issue: "¿Sientes que tu equipo calienta demasiado?",
      solution: "Mantenimiento fisico de tu equipo a profundidad.",
      icon: Monitor,
    },
  ];

  return (
    <div className="relative flex flex-col gap-4 h-full p-6 bg-gradient-to-br from-muted/20 via-accent/5 to-secondary/10 rounded-2xl border-2 border-accent/30 shadow-lg">
      <div className="relative w-full mx-auto mb-2 rounded-2xl group">
        <AspectRatio ratio={16 / 9} className="z-0 overflow-hidden rounded-2xl">
          <Image
            src={SKELETON_THREE_CONFIG.image}
            alt={SKELETON_THREE_CONFIG.alt}
            fill
            className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium">
              {SKELETON_THREE_CONFIG.description}
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-accent/90 text-accent-foreground rounded-full p-1.5 z-10 group-hover:scale-110 transition-transform duration-500">
            <IconTool size={14} />
          </div>
        </AspectRatio>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <IconSearch size={16} className="text-primary" />
          <h4 className="text-sm font-bold text-foreground">
            Diagnóstico de problemas comunes, encuentra la solución en{" "}
            <span className="font-bold text-primary">Renovabit.</span>
          </h4>
        </div>
        {problems.map((problem, idx) => {
          const IconComponent = problem.icon;
          return (
            <div
              key={idx}
              className="group p-4 bg-gradient-to-r from-card to-card/80 rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <IconComponent size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary-foreground mb-2">
                    {problem.issue}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <IconBulb size={12} className="text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Solución:{" "}
                      <span className="font-medium text-foreground">
                        {problem.solution}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
