import { Badge } from "@renovabit/ui/src/components/ui/badge";
import { Button } from "@renovabit/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@renovabit/ui/src/components/ui/card";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import TitleSection from "./common/title-section";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline";
  href: string;
}

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
    href: "/contacto",
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
    href: "/contacto",
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
    href: "/contacto",
  },
];

const PricingCard = ({ plan }: { plan: PricingPlan }) => (
  <Card
    className={`
    relative flex flex-col transition-all duration-300 hover:shadow-xl 
    ${
      plan.isPopular
        ? "bg-gradient-to-br from-accent/5 to-accent/10 border-primary/30 shadow-lg scale-105"
        : "bg-gradient-to-br from-card to-muted/20 border-border hover:border-primary/20"
    }
  `}
  >
    {/* Badge Popular */}
    {plan.isPopular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <Badge className="bg-primary text-primary-foreground border-primary/20 shadow-lg">
          <Star className="w-3 h-3 mr-1" />
          Más Popular
        </Badge>
      </div>
    )}

    <CardHeader className="text-center">
      <CardTitle
        className={`text-lg font-bold ${plan.isPopular ? "text-primary" : ""}`}
      >
        {plan.name}
      </CardTitle>
      <div className="my-4">
        <span className="text-3xl font-bold">
          {plan.currency}
          {plan.price}
        </span>
        <span className="text-muted-foreground text-sm ml-1">
          {plan.period}
        </span>
      </div>
      <CardDescription className="text-sm">{plan.description}</CardDescription>
    </CardHeader>

    <CardContent className="space-y-4 flex-1">
      <hr className="border-dashed border-border" />

      <ul className="space-y-3 text-sm">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>

    <CardFooter className="mt-auto pt-6">
      <Button
        asChild
        variant={plan.buttonVariant}
        className={`w-full transition-all duration-300 ${
          plan.isPopular
            ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
            : "border-primary/30 hover:bg-primary/10"
        }`}
      >
        <Link href={plan.href}>{plan.buttonText}</Link>
      </Button>
    </CardFooter>
  </Card>
);

export default function Pricing() {
  return (
    <section className="relative py-16 md:py-24">
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
