import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renovabit/ui/src/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
} from "@renovabit/ui/src/components/ui/card";
import { Quote } from "lucide-react";
import Image from "next/image";
import TitleSection from "./common/title-section";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  image?: string;
  testimonial: string;
  featured?: boolean;
}

const testimonialsData: Testimonial[] = [
  {
    id: "cliente-1",
    name: "Javuer Montoya",
    role: "Estudiante de Administración",
    image: "/images/services/soporte.png",
    testimonial:
      "Me hicieron el mantenimiento completo de mi laptop, además de actualizarla de Windows 10 a Windows 11 y ampliar el almacenamiento con un SSD y más RAM. Ahora corre mucho más rápido y puedo trabajar sin problemas. Muy agradecido con el servicio.",
    featured: true,
  },
  {
    id: "cliente-2",
    name: "Mariana Cáceres",
    role: "Estudiante de Arquitectura",
    testimonial:
      "Tenía mi computadora lenta y con poco espacio. Me ayudaron con la limpieza, instalación de programas de arquitectura y ampliación de memoria. Todo quedó funcionando de maravilla y pude seguir con mis proyectos sin perder tiempo.",
  },
  {
    id: "cliente-3",
    name: "Sr. Lucio",
    role: "Ingeniero de Minas – Jefe de Departamento",
    testimonial:
      "Solicité el servicio a domicilio y quedé sorprendido con la puntualidad y profesionalismo. Me hicieron mantenimiento, revisión de la tarjeta gráfica e instalación de programas. Tener todo resuelto en mi oficina fue una gran ventaja.",
  },
  {
    id: "cliente-4",
    name: "Paola Rivera",
    role: "Docente Universitaria",
    testimonial:
      "Mi laptop sufrió un accidente con agua y no prendía. En menos de tres días me la devolvieron reparada y funcionando como antes. Fue un alivio enorme y valió totalmente la pena confiar.",
  },
];

const TestimonialCard = ({
  testimonial,
  className = "",
}: {
  testimonial: Testimonial;
  className?: string;
}) => {
  if (testimonial.featured) {
    return (
      <Card
        className={`grid grid-rows-[auto_1fr] gap-8 sm:p-6 bg-gradient-to-br from-card to-muted/20 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg ${className}`}
      >
        <CardHeader>
          {testimonial.image && (
            <div className="w-full h-auto rounded-2xl">
              <AspectRatio ratio={16 / 9}>
                <Image
                  className="object-cover rounded-2xl "
                  src={testimonial.image}
                  alt={`${testimonial.name} Imagen`}
                  fill
                />
              </AspectRatio>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
            <div className="space-y-4">
              <p className="text-xl font-medium leading-relaxed">
                "{testimonial.testimonial}"
              </p>
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-3">
              <Avatar className="size-12 ring-2 ring-primary/10">
                <AvatarImage alt={testimonial.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <cite className="text-sm font-medium not-italic">
                  {testimonial.name}
                </cite>
                <span className="text-muted-foreground block text-sm">
                  {testimonial.role}
                </span>
                {testimonial.company && (
                  <span className="text-primary/70 block text-xs">
                    {testimonial.company}
                  </span>
                )}
              </div>
            </div>
          </blockquote>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-gradient-to-br from-card to-muted/20 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardContent className="h-full pt-6">
        <blockquote className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
          <div className="flex items-center justify-between">
            <Quote className="w-6 h-6 text-primary/20" />
          </div>

          <p className="leading-relaxed text-base text-muted-foreground">
            "{testimonial.testimonial}"
          </p>

          <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-2">
            <Avatar className="size-10 ring-2 ring-primary/10">
              <AvatarImage alt={testimonial.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <cite className="text-sm font-medium not-italic">
                {testimonial.name}
              </cite>
              <div className="text-xs text-muted-foreground">
                {testimonial.role}
                {testimonial.company && (
                  <>
                    <br />
                    <span className="text-primary/70">
                      {testimonial.company}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </blockquote>
      </CardContent>
    </Card>
  );
};

export default function Testimonials() {
  const featuredTestimonial = testimonialsData.find((t) => t.featured);
  const regularTestimonials = testimonialsData.filter((t) => !t.featured);

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <TitleSection
          title="Testimonios"
          subtitle="Lo que dicen nuestros clientes"
          description="Conoce las experiencias reales de quienes han confiado en RenovaBit para sus equipos tecnológicos."
        />

        <div className="mt-12 md:mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          {featuredTestimonial && (
            <TestimonialCard
              testimonial={featuredTestimonial}
              className="sm:col-span-2 lg:row-span-2"
            />
          )}

          {regularTestimonials[0] && (
            <TestimonialCard
              testimonial={regularTestimonials[0]}
              className="md:col-span-2"
            />
          )}

          {regularTestimonials.slice(1).map((testimonial) => (
            <TestimonialCard
              className="md:col-span-2 lg:col-span-1"
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
