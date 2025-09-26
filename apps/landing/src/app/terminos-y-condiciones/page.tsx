import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | RenovaBit",
  description:
    "Condiciones de uso de los servicios de RenovaBit: reparaciones, soporte técnico y ventas.",
  robots: { index: true, follow: true },
};

export default function TerminosCondicionesPage() {
  return (
    <main className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Términos y Condiciones
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Última actualización: 26 de septiembre de 2025
      </p>

      <section className="space-y-4 mb-8">
        <p>
          Estos términos regulan el uso de los servicios ofrecidos por
          RenovaBit, incluyendo reparación de laptops y PCs, soporte técnico y
          venta de equipos y componentes. Al contratar o usar nuestros
          servicios, aceptas estas condiciones.
        </p>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Servicios y alcances</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            El diagnóstico inicial es referencial y puede ajustarse tras una
            evaluación completa.
          </li>
          <li>
            Las reparaciones y mantenimientos se realizan con prácticas
            profesionales y, cuando aplica, con repuestos de calidad.
          </li>
          <li>
            La evidencia fotográfica de ingreso/salida se usa para transparencia
            y control de calidad.
          </li>
        </ul>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Presupuestos y pagos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Los presupuestos tienen una validez limitada indicada en la
            cotización.
          </li>
          <li>
            Los pagos pueden requerir adelantos para adquisición de repuestos.
          </li>
          <li>
            Las garantías aplican según la naturaleza del servicio y se
            especifican en el comprobante o informe.
          </li>
        </ul>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Responsabilidad del cliente</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Respaldar su información antes de entregar el equipo, salvo que se
            contrate respaldo con nosotros.
          </li>
          <li>Retirar equipos dentro de los plazos acordados.</li>
          <li>
            Brindar información veraz del equipo y sus fallas para un correcto
            diagnóstico.
          </li>
        </ul>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Limitación de responsabilidad</h2>
        <p>
          RenovaBit no será responsable por daños indirectos o pérdida de datos
          no atribuibles a dolo o negligencia grave. En ningún caso la
          responsabilidad excederá el monto efectivamente pagado por el servicio
          específico.
        </p>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Datos personales</h2>
        <p>
          El tratamiento de datos personales se rige por nuestra Política de
          Privacidad. Para solicitar la eliminación de sus datos, escriba a
          <span className="font-medium"> soporte@renovabit.com</span>.
        </p>
      </section>

      <section className="space-y-2 border-t pt-6">
        <h2 className="text-xl font-medium">Contacto</h2>
        <p>
          Si tienes preguntas sobre estos términos, contáctanos en
          <span className="font-medium"> soporte@renovabit.com</span>.
        </p>
      </section>
    </main>
  );
}
