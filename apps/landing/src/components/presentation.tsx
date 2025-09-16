import { socialLinks } from "@renovabit/shared/src/config/links";
import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import { Badge } from "@renovabit/ui/src/components/ui/badge";
import { Button } from "@renovabit/ui/src/components/ui/button";
import { Card } from "@renovabit/ui/src/components/ui/card";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Laptop,
  MapPin,
  Shield,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TitleSection from "./common/title-section";

export default function Presentation() {
  const stats = [
    { icon: Users, value: "5+", label: "Clientes iniciales satisfechos" },
    { icon: Laptop, value: "100%", label: "Enfoque en laptops y PCs" },
    { icon: Award, value: "Compromiso", label: "Calidad garantizada" },
    {
      icon: MapPin,
      value: "Arequipa - Miraflores",
      label: "Atención local y remota",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <TitleSection
          title="Conócenos"
          subtitle="RenovaBit"
          description="Conoce quiénes somos y por qué somos tu mejor opción en Arequipa."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            {/* Contenido de texto */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Servicio y Soporte Técnico
                </Badge>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-center lg:text-left">
                Soluciones confiables para{" "}
                <span className="text-primary">Laptops y PCs</span>
              </h3>

              <p className="text-base md:text-lg text-muted-foreground text-center lg:text-left leading-relaxed">
                En <strong>RenovaBit</strong> creemos que cada equipo merece una
                segunda vida. Ofrecemos mantenimiento, reparaciones y mejoras de
                rendimiento con un enfoque práctico y accesible. Nuestro
                compromiso es brindar un servicio cercano y confiable, pensado
                para las necesidades reales de cada cliente.
              </p>
            </div>

            {/* Características destacadas */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm md:text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Atención personalizada y diagnósticos claros</span>
              </div>
              <div className="flex items-center gap-3 text-sm md:text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Soporte remoto para resolver problemas al instante</span>
              </div>
              <div className="flex items-center gap-3 text-sm md:text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Venta de componentes originales con garantía</span>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 pt-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-3 sm:p-4 bg-gradient-to-br from-card to-muted/20 border-primary/20 hover:border-primary/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm sm:text-base md:text-lg font-bold truncate">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-xs text-muted-foreground leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                effect={"shineHover"}
                icon={Star}
                iconPlacement="left"
                asChild
              >
                <Link href={socialLinks.whatsapp}>Solicitar diagnóstico</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
                effect={"expandIcon"}
                icon={ArrowRight}
                iconPlacement="right"
                asChild
              >
                <Link href="/#todos-los-servicios">Ver nuestros servicios</Link>
              </Button>
            </div>
          </div>

          {/* Imágenes */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-108 lg:h-108">
              <div className="absolute top-0 left-0 w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 z-20 group">
                <div className="relative w-full h-full">
                  <AspectRatio
                    ratio={1}
                    className="w-full h-full rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500"
                  >
                    <Image
                      src="/images/services/mantenimiento.webp"
                      alt="Mantenimiento preventivo de laptops y PCs en Arequipa - RenovaBit limpieza profesional"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">
                        Equipo especializado
                      </p>
                    </div>
                  </AspectRatio>

                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg z-10">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 z-10 group">
                <div className="relative w-full h-full">
                  <AspectRatio
                    ratio={1}
                    className="w-full h-full rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500"
                  >
                    <Image
                      src="/images/services/reparacion.png"
                      alt="Reparación electrónica avanzada de laptops en Arequipa - Microsoldadura SMD especializada"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">
                        Siempre a disposición
                      </p>
                    </div>
                  </AspectRatio>

                  <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg z-10">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
