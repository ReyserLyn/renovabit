import { socialLinks } from "@renovabit/shared/src/config/links";
import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import { Badge } from "@renovabit/ui/src/components/ui/badge";
import { Button } from "@renovabit/ui/src/components/ui/button";
import { Card } from "@renovabit/ui/src/components/ui/card";
import {
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Monitor,
  Shield,
  Star,
  Truck,
  UserCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TitleSection from "./common/title-section";

export default function Domicile() {
  const availableServices = [
    {
      icon: Wrench,
      title: "Mantenimiento físico y lógico",
      description:
        "Limpieza profunda, cambio de pasta térmica, optimización de software",
    },
    {
      icon: Monitor,
      title: "Instalación y activación de programas",
      description:
        "Sistemas operativos, licencias originales, software especializado",
    },
    {
      icon: Truck,
      title: "Recolección de equipos",
      description:
        "Si tu reparación requiere herramientas de laboratorio, llevamos tu laptop/PC al taller y lo devolvemos reparado",
    },
  ];

  const trustBadges = [
    { icon: UserCheck, text: "Técnicos certificados" },
    { icon: Clock, text: "Puntualidad garantizada" },
    { icon: Shield, text: "Herramientas profesionales" },
    { icon: Star, text: "Atención personalizada" },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <TitleSection
          title="Servicio a Domicilio"
          subtitle="Disponible en toda Arequipa"
          description="Llevamos nuestro servicio técnico hasta ti, con el mismo profesionalismo que en nuestro local."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Imagen principal */}
              <div className="relative w-full h-full group">
                <AspectRatio
                  ratio={1}
                  className="w-full h-full rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500"
                >
                  <Image
                    src="/images/services/soporte.png"
                    alt="Servicio técnico de laptops a domicilio en Arequipa - Atención profesional en casa"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="rounded-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">
                      Servicio profesional en tu hogar
                    </p>
                  </div>
                </AspectRatio>

                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-3 shadow-lg z-10">
                  <Home className="w-5 h-5" />
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-center lg:text-left">
                Comodidad y profesionalismo{" "}
                <span className="text-primary">en tu hogar</span>
              </h3>

              <p className="text-base md:text-lg text-muted-foreground text-center lg:text-left leading-relaxed">
                Servicio técnico profesional con traslado incluido. Previa
                coordinación para garantizar disponibilidad y el mejor horario
                para ti.
              </p>
            </div>

            {/* Precios */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">
                        S/119
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Arequipa metropolitana
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary-foreground">
                        S/139
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Zonas alejadas
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Truck className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      Recolección para reparación y entrega
                    </div>
                    <div className="text-xs text-muted-foreground">
                      S/50 adicionales - Incluye traslado seguro hasta el taller
                      y devolución en tu domicilio
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="flex justify-center lg:justify-start pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                effect={"shineHover"}
                icon={MessageCircle}
                iconPlacement="left"
                asChild
              >
                <Link href={socialLinks.whatsapp}>Agendar por WhatsApp</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="mt-8">
          <div className="flex flex-col items-center mb-8">
            <h4 className="text-lg md:text-xl font-semibold text-center mb-4">
              Servicios disponibles a domicilio
            </h4>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {trustBadges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary/10 text-secondary-foreground border-secondary/20 text-xs px-3 py-1 hover:cursor-pointer"
                >
                  <badge.icon className="w-3 h-3 mr-1" />
                  {badge.text}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableServices.slice(0, 2).map((service, index) => (
              <Card
                key={index}
                className="p-6 bg-gradient-to-br from-card to-muted/20 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-base mb-2">
                      {service.title}
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tercer servicio */}
          {availableServices[2] && (
            <div className="flex justify-center mt-6">
              <div className="w-full md:w-1/2 lg:w-2/5">
                <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      {(() => {
                        const IconComponent = availableServices[2].icon;
                        return (
                          <IconComponent className="w-6 h-6 text-primary" />
                        );
                      })()}
                    </div>
                    <div>
                      <h5 className="font-semibold text-base mb-2">
                        {availableServices[2].title}
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {availableServices[2].description}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
