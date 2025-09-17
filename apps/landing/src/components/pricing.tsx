import { socialLinks } from "@renovabit/shared/src/config/links";
import { BrushCleaning, LaptopMinimalCheck, Microchip } from "lucide-react";
import TitleSection from "./common/title-section";
import PricingCard, { type PricingPlan } from "./navbar/pricing-card";

const pricingPlans: PricingPlan[] = [
  {
    id: "soporte-remoto",
    name: "Soporte Remoto",
    price: 49,
    currency: "S/",
    period: "por sesión",
    description: "Asistencia técnica inmediata sin salir de casa",
    features: [
      "Conexión remota segura (RustDesk) para diagnóstico y solución",
      "Instalación de programas básicos y avanzados",
      "Antivirus con licencia por 1 año",
      "Actualización de controladores y configuraciones",
      "Optimización de arranque y rendimiento",
      "Eliminación de malware y limpieza de archivos temporales",
      "Asesoría en tiempo real con un técnico especializado",
    ],
    buttonText: "Solicitar soporte",
    buttonVariant: "outline",
    buttonEffect: "shineHover",
    buttonIcon: LaptopMinimalCheck,
    buttonIconPlacement: "left",
    href: socialLinks.whatsapp,
  },
  {
    id: "mantenimiento-fisico-logico",
    name: "Mantenimiento Físico y Lógico",
    price: 79,
    currency: "S/",
    period: "desde",
    description: "Mantenimiento preventivo y mejora de rendimiento",
    features: [
      "Limpieza interna con aire comprimido y herramientas antiestáticas",
      "Cambio de pasta térmica de alta conductividad",
      "Mantenimiento y lubricación de cooler",
      "Limpieza de tarjetas y conectores con alcohol isopropílico",
      "Formateo y particionado de disco duro y SSD",
      "Instalación de Windows y programas básicos",
      "Instalación de software especializado (diseño, ingeniería, etc.)",
      "Drivers y librerías esenciales",
      "Optimización completa del sistema",
      "Servicio a domicilio disponible",
      "Garantía de 30 días en el servicio",
    ],
    isPopular: true,
    buttonText: "Contratar mantenimiento",
    buttonVariant: "default",
    href: socialLinks.whatsapp,
    buttonEffect: "shineHover",
    buttonIcon: BrushCleaning,
    buttonIconPlacement: "left",
  },
  {
    id: "reparacion",
    name: "Reparación Avanzada",
    price: 149,
    currency: "S/",
    period: "desde",
    description: "Reparación electrónica y recuperación a nivel de componente",
    features: [
      "Reparación de tarjetas madre y laptops a nivel de microelectrónica SMD",
      "Programación de BIOS y chips (EEPROM, KBC, ITE, ENE, eMMC, etc.)",
      "Detección y reparación de cortos por líquidos o sobrecargas",
      "Cambio de pantallas, teclados, bisagras y flex en laptops",
      "Repotenciado y upgrades de hardware (RAM, SSD, HDD)",
      "Recuperación avanzada de datos",
      "Armado de PC a medida según necesidad del cliente",
      "Garantía extendida hasta 90 días",
    ],
    buttonText: "Solicitar reparación",
    buttonVariant: "outline",
    href: socialLinks.whatsapp,
    buttonEffect: "shineHover",
    buttonIcon: Microchip,
    buttonIconPlacement: "left",
  },
];

export default function Pricing() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: <Es temporal>
    <section className="relative py-16 md:py-24" id="todos-los-servicios">
      <div className="max-w-7xl mx-auto px-4">
        <TitleSection
          title="Precios"
          subtitle="Servicios accesibles y transparentes"
          description="Conoce nuestros planes de servicio técnico especializado para laptops y PCs"
        />

        <div className="mt-12 md:mt-20 grid gap-12 md:grid-cols-3 lg:gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            * Los precios pueden variar según la complejidad del problema. Todos
            nuestros servicios incluyen diagnóstico gratuito y presupuesto sin
            compromiso.
          </p>
        </div>
      </div>
    </section>
  );
}
