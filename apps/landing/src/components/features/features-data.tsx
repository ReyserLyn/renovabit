import { SkeletonFour } from "./skeleton-four";
import { SkeletonOne } from "./skeleton-one";
import { SkeletonThree } from "./skeleton-three";
import { SkeletonTwo } from "./skeleton-two";
import type { Feature } from "./types";

export const featuresData: Feature[] = [
  {
    title: "Reparación de laptops",
    description:
      "Reparamos hardware, BIOS y realizamos microsoldadura SMD. Diagnóstico gratuito y garantía en todos nuestros trabajos de reparación.",
    skeleton: <SkeletonOne />,
    className: "col-span-1 lg:col-span-4 border-b lg:border-r border-border",
  },
  {
    title: "Soporte técnico remoto",
    description:
      "Instalación de programas, optimización de equipos y protección antivirus desde la comodidad de tu hogar.",
    skeleton: <SkeletonTwo />,
    className: "border-b col-span-1 lg:col-span-2 border-border",
  },
  {
    title: "Mantenimiento y mejoras",
    description:
      "Actualizamos tu equipo con SSD, memoria RAM adicional y limpieza profunda para un rendimiento óptimo.",
    skeleton: <SkeletonThree />,
    className: "col-span-1 lg:col-span-3 lg:border-r border-border",
  },
  {
    title: "Ensamblado y venta de componentes",
    description:
      "Ensamblamos PCs personalizadas y vendemos componentes originales con garantía. Asesoría técnica incluida.",
    skeleton: <SkeletonFour />,
    className: "col-span-1 lg:col-span-3 border-b lg:border-none",
  },
];
