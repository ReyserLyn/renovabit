import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renovabit/ui/src/components/ui/accordion";
import { Button } from "@renovabit/ui/src/components/ui/button";
import { MessageCircle } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";
import TitleSection from "./common/title-section";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQs() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "shield-check",
      question: "¿Ofrecen garantía por las reparaciones realizadas?",
      answer:
        "Sí. Todos nuestros servicios incluyen garantía, la cual varía entre 30 y 90 días según el tipo de reparación. Esto asegura que tu equipo quede protegido después del servicio.",
    },
    {
      id: "item-2",
      icon: "search",
      question: "¿El diagnóstico inicial tiene algún costo?",
      answer:
        "El diagnóstico es gratuito únicamente si aceptas la reparación. En caso decidas no continuar, el diagnóstico tiene un costo de S/45, ya que incluye la revisión completa y pruebas técnicas realizadas por nuestros especialistas.",
    },
    {
      id: "item-3",
      icon: "alert-triangle",
      question: "¿Qué pasa si el equipo no tiene solución?",
      answer:
        "Si tu equipo no puede repararse o no resulta conveniente hacerlo, se te informará de inmediato. En este caso, solo se cobra el diagnóstico (S/45), que cubre todas las pruebas y evaluaciones necesarias para determinar la condición real del equipo. La decisión final siempre queda en tus manos.",
    },
    {
      id: "item-4",
      icon: "home",
      question: "¿Ofrecen servicio a domicilio?",
      answer:
        "Sí. Tenemos servicio a domicilio en Arequipa desde S/119. Si la ubicación es muy lejana, el costo es de S/139. También ofrecemos recojo y entrega de equipos por un adicional de S/50.",
    },
    {
      id: "item-5",
      icon: "cpu",
      question: "¿El servicio incluye asesoría sobre qué componentes comprar?",
      answer:
        "Claro. Nuestros técnicos pueden recomendarte las mejores opciones en memoria, almacenamiento y otros componentes, de acuerdo a tu presupuesto y necesidades específicas.",
    },
    {
      id: "item-6",
      icon: "file-text",
      question: "¿Recibiré un informe del estado y proceso de mi equipo?",
      answer:
        "Sí. En RenovaBit entregamos un informe técnico en formato PDF totalmente gratuito, tanto en el diagnóstico como en la reparación. Este informe incluye el estado en el que llegó tu equipo, el detalle de las pruebas realizadas, el progreso de las intervenciones y el estado final con evidencias fotográficas o capturas de tests del equipo. De esta manera garantizamos transparencia total y evitamos cualquier duda sobre el servicio realizado.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <TitleSection
          title="Preguntas Frecuentes"
          subtitle="Resuelve tus dudas"
          description="No encuentras lo que buscas? Contactanos por WhatsApp"
        />
        <div className="mt-12 md:mt-16 flex flex-col gap-10 md:flex-row md:gap-16 justify-center items-center">
          <div className="md:w-2/3 w-full">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button className="w-full mt-4" asChild size="lg">
              <Link
                href="https://wa.me/51987654321"
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="text-center">
                  <span className="hidden sm:inline">
                    ¿Tienes alguna otra duda? Contáctanos por WhatsApp
                  </span>
                  <span className="sm:hidden">
                    ¿Dudas? Contáctanos por WhatsApp
                  </span>
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
