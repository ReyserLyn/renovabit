import { socialLinks } from "@renovabit/shared/src/config/links";
import { Button } from "@renovabit/ui/src/components/ui/button";
import {
  IconCpu2,
  IconInfoCircle,
  IconShoppingCart,
  IconTool,
} from "@tabler/icons-react";
import { HardDrive, MemoryStick, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { Component } from "./types";

export const SkeletonFour = () => {
  const components: Component[] = [
    {
      name: "Memoria RAM DDR4",
      specs: "8GB - 16GB / DDR3, DDR4, DDR5",
      price: "S/ 79",
      category: "Memoria RAM",
      icon: MemoryStick,
    },
    {
      name: "SSD NVMe",
      specs: "256GB - 512GB - 1TB - 2TB - 4TB",
      price: "S/ 129",
      category: "Almacenamiento SSD SATA y NVMe",
      icon: HardDrive,
    },
  ];

  return (
    <div className="relative flex flex-col gap-3 h-full p-5 bg-gradient-to-br from-primary/8 via-accent/5 to-secondary/8 rounded-2xl border-2 border-primary/20 shadow-lg">
      <div className="text-center mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <IconShoppingCart size={18} className="text-primary" />
          <h4 className="text-sm font-bold text-foreground">
            Componentes en venta
          </h4>
        </div>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <IconTool size={12} />
          Encuentra los mejores componentes para tu equipo en{" "}
          <span className="font-bold text-primary">Renovabit.</span>
        </p>
      </div>

      <div className="space-y-3">
        {components.map((component, idx) => {
          const IconComponent = component.icon;
          return (
            <div
              key={idx}
              className="group p-4 bg-gradient-to-r from-card to-card/90 rounded-xl shadow-sm border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <IconComponent size={18} />
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold border border-primary/20">
                      {component.category}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-secondary-foreground mb-1">
                    {component.name}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <IconCpu2 size={12} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {component.specs}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Desde
                    </p>
                    <p className="text-sm font-bold text-secondary-foreground">
                      {component.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mt-2">
        <div className="p-3 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1 ">
              <IconInfoCircle size={14} className="text-primary" />
              <p className="text-xs uppercase tracking-wider text-primary font-bold">
                Instalación gratuita
              </p>
            </div>
            <p className="text-xs text-muted-foreground w-2/3 mx-auto">
              Toda compra en Renovabit incluye instalación gratuita para tu
              equipo en cuestion de minutos.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-lg hover:shadow-xl"
          icon={ShoppingCart}
          iconPlacement="left"
          effect="shineHover"
          asChild
        >
          <Link href={socialLinks.whatsapp}>
            Preguntar por otro componente o ensamblado
          </Link>
        </Button>
      </div>
    </div>
  );
};
