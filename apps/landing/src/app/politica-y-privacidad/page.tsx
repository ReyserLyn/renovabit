import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | RenovaBit",
  description:
    "Conoce cómo RenovaBit recopila, usa y protege tus datos personales. Transparencia y seguridad para nuestros clientes.",
  robots: { index: true, follow: true },
};

export default function PoliticaPrivacidadPage() {
  return (
    <main className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Política de Privacidad
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Última actualización: 26 de septiembre de 2025
      </p>

      <section className="space-y-4 mb-8">
        <p>
          En RenovaBit valoramos tu privacidad. Esta política explica de forma
          clara qué datos recopilamos, con qué finalidad y cómo los protegemos.
          Aplica a nuestros servicios de reparación de laptops y PCs, soporte
          técnico y venta de equipos y componentes.
        </p>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Datos que recopilamos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Datos de contacto: nombre, teléfono, email.</li>
          <li>
            Detalles del equipo: marca, modelo, serie y condición de ingreso.
          </li>
          <li>
            Información de servicio: diagnóstico, trabajos realizados, evidencia
            fotográfica del estado de entrada/salida.
          </li>
          <li>
            Datos de facturación y compra cuando corresponda (según la ley).
          </li>
        </ul>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Cómo usamos tus datos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Prestar y gestionar servicios de reparación y soporte.</li>
          <li>Brindar atención al cliente y seguimiento de casos.</li>
          <li>Emitir comprobantes de pago y gestionar garantías.</li>
          <li>Mejorar la calidad y seguridad de nuestros servicios.</li>
        </ul>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Base legal y conservación</h2>
        <p>
          Tratamos datos con base en tu consentimiento y/o ejecución de un
          contrato de servicio. Conservamos la información el tiempo necesario
          para cumplir finalidades legales, contables y de garantía.
        </p>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Compartición y seguridad</h2>
        <p>
          No vendemos tus datos. Podremos compartirlos con proveedores
          estrictamente necesarios (p. ej., laboratorio o logística) bajo
          acuerdos de confidencialidad. Implementamos medidas técnicas y
          organizativas razonables para proteger tu información.
        </p>
      </section>

      <section className="space-y-2 mb-8">
        <h2 className="text-xl font-medium">Tus derechos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Acceso, rectificación, actualización y portabilidad.</li>
          <li>Oposición o limitación del tratamiento cuando proceda.</li>
          <li>Eliminación de datos conforme a normativa aplicable.</li>
        </ul>
        <p className="mt-2">
          Para ejercer tus derechos o realizar consultas, contáctanos a
          <span className="font-medium"> soporte@renovabit.com</span>.
        </p>
      </section>

      <section className="space-y-2 border-t pt-6">
        <h2 className="text-xl font-medium">Eliminación de datos</h2>
        <p>
          Para solicitar la eliminación de sus datos, escriba a
          <span className="font-medium"> soporte@renovabit.com</span>.
        </p>
      </section>
    </main>
  );
}
