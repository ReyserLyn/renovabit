import { IconCpu, IconDeviceLaptop, IconSettings } from "@tabler/icons-react";
import { CheckCircle, Wrench } from "lucide-react";
import { ImageCard } from "../common/image-card";

const SKELETON_ONE_CONFIG = {
  image: "/images/services/taller.avif",
  alt: "Foto del taller de RenovaBit",
  description:
    "Taller de RenovaBit, Herramientas especializadas para la reparación de laptops.",
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex gap-10 h-full">
      <div className="w-full p-6 mx-auto bg-gradient-to-br from-card via-card to-muted/20 h-full rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-1 w-full h-full flex-col space-y-5">
          <ImageCard
            image={SKELETON_ONE_CONFIG.image}
            alt={SKELETON_ONE_CONFIG.alt}
            description={SKELETON_ONE_CONFIG.description}
            icon={IconDeviceLaptop}
            iconSize={16}
            aspectRatio="video"
            width={740}
            height={463}
          />

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
