import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import { IconCpu, IconDeviceLaptop, IconSettings } from "@tabler/icons-react";
import { CheckCircle, Wrench } from "lucide-react";
import Image from "next/image";

const SKELETON_ONE_CONFIG = {
  image: "/images/services/reparacion.png",
  alt: "Reparación de laptops",
  description:
    "Especialistas en reparación de laptops con tecnología avanzada y garantía completa.",
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex gap-10 h-full">
      <div className="w-full p-6 mx-auto bg-gradient-to-br from-card via-card to-muted/20 h-full rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-1 w-full h-full flex-col space-y-5">
          <div className="relative w-full mx-auto mb-2 rounded-2xl group">
            <AspectRatio
              ratio={16 / 9}
              className="z-0 overflow-hidden rounded-2xl"
            >
              <Image
                src={SKELETON_ONE_CONFIG.image}
                alt={SKELETON_ONE_CONFIG.alt}
                fill
                className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">
                  {SKELETON_ONE_CONFIG.description}
                </p>
              </div>
              <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground rounded-full p-2 z-10 group-hover:scale-110 transition-transform duration-500">
                <IconDeviceLaptop size={16} />
              </div>
            </AspectRatio>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/30 rounded-xl text-xs font-semibold">
              <Wrench size={14} />
              Todas las marcas
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary-foreground border border-secondary/30 rounded-xl text-xs font-semibold">
              <IconSettings size={14} />
              Reprogramación de BIOS
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-accent/5 text-accent-foreground border border-accent/30 rounded-xl text-xs font-semibold">
              <IconCpu size={14} />
              Microsoldadura SMD Avanzada
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/30 ">
            <CheckCircle size={16} className="text-primary" />
            <span className="text-sm text-secondary-foreground ">
              Toda reparación incluye diagnóstico gratuito. No esperes más!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
