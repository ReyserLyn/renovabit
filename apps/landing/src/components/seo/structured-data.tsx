/** biome-ignore-all lint/correctness/useUniqueElementIds: <Is structured data> */
/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <Is structured data> */
"use client";

import Script from "next/script";
import {
  localBusinessStructuredData,
  organizationStructuredData,
  websiteStructuredData,
} from "@/config/seo";

export function StructuredData() {
  return (
    <>
      {/* LocalBusiness Schema */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessStructuredData),
        }}
      />

      {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />

      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
    </>
  );
}

// Componente para Schema específico de servicios
export function ServiceStructuredData({
  serviceName,
  description,
  price,
}: {
  serviceName: string;
  description: string;
  price: string;
}) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: description,
    provider: {
      "@type": "Organization",
      name: "RenovaBit",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Av. Goyeneche 1602",
        addressLocality: "Arequipa",
        addressRegion: "Arequipa",
        addressCountry: "Perú",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Arequipa",
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "PEN",
    },
  };

  return (
    <Script
      id={`service-schema-${serviceName.toLowerCase().replace(/\s+/g, "-")}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema),
      }}
    />
  );
}

// Componente para FAQ Schema (para la sección de FAQs)
export function FAQStructuredData({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}
