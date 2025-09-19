import type { Metadata } from "next";

// Configuración base del sitio
export const siteConfig = {
  name: "RenovaBit",
  title: "RenovaBit - Servicio Técnico de Laptops y PCs en Arequipa",
  description:
    "Servicio técnico especializado en Arequipa. Reparación laptops, mantenimiento a domicilio, soporte remoto y armado de PCs.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.renovabit.com",
  ogImage: "/og-image.jpg?v=1",

  // Información de contacto y ubicación
  business: {
    name: "RenovaBit",
    address: "Av. Goyeneche 1602, Miraflores, Arequipa - 04004",
    phone: "+51 987 471 074",
    email: "contacto@renovabit.com",
    city: "Arequipa",
    region: "Arequipa",
    country: "Perú",
    postalCode: "04004",
    coordinates: {
      latitude: "-16.409047",
      longitude: "-71.537451",
    },
  },

  // Servicios principales para palabras clave
  services: [
    "Servicio técnico de laptops",
    "Reparación de computadoras",
    "Mantenimiento preventivo",
    "Soporte técnico remoto",
    "Armado de PCs gaming",
    "Venta de componentes",
    "Recuperación de datos",
    "Instalación de software",
  ],

  // Palabras clave principales
  keywords: [
    // Principales
    "servicio técnico arequipa",
    "reparación laptops arequipa",
    "técnico computadoras arequipa",
    "mantenimiento pc arequipa",
    "soporte técnico arequipa",

    // Long-tail
    "reparación laptops a domicilio arequipa",
    "servicio técnico laptops miraflores arequipa",
    "mantenimiento computadoras domicilio arequipa",
    "armado pc gaming arequipa",
    "soporte técnico remoto arequipa",

    // Emergencia/Problemas
    "laptop no enciende arequipa",
    "pantalla laptop rota arequipa",
    "virus computadora arequipa",
    "laptop lenta arequipa",
    "recuperar datos arequipa",

    // Comerciales
    "venta componentes pc arequipa",
    "upgrade laptop arequipa",
    "instalación ram arequipa",
    "cambio disco duro ssd arequipa",
    "ensamblado pc arequipa",

    // Distritos específicos
    "servicio técnico miraflores arequipa",
    "reparación laptops cayma arequipa",
    "técnico computadoras cercado arequipa",

    // Marcas y tecnologías
    "reparación motherboard arequipa",
    "cambio pasta térmica arequipa",
    "instalación windows arequipa",
    "formateo computadora arequipa",
  ],
};

// Metadata base para el sitio
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  // Información del autor/empresa
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  // Configuración del formato
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Servicio Técnico en Arequipa`,
      },
    ],
  },

  // Twitter/X Cards
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/twitter-card.jpg?v=1"],
    creator: "@RenovaBit",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
      noimageindex: false,
    },
  },

  // Enlaces canónicos
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "es-PE": siteConfig.url,
    },
  },

  // Verification tags
  verification: {
    google: "7Q5lqvjWHcpuMW3CdX9IfWbcj3bmTNC0GGb3-hdfbCE",
  },

  // Categorización
  category: "technology",

  // Iconos esenciales para SEO
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

// Función para generar metadata específica de páginas
export function generatePageMetadata({
  title,
  description,
  keywords,
  canonical,
  image,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const allKeywords = keywords
    ? [...siteConfig.keywords, ...keywords]
    : siteConfig.keywords;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    alternates: {
      canonical: canonical || siteConfig.url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
  };
}

// JSON-LD Structured Data para LocalBusiness
export const localBusinessStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}#business`,
  name: siteConfig.business.name,
  image: [
    `${siteConfig.url}/logo/ts/dark/horizontal.svg`,
    `${siteConfig.url}/og-image.jpg?v=1`,
  ],
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.business.phone,
  email: siteConfig.business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Goyeneche 1602",
    addressLocality: siteConfig.business.city,
    addressRegion: siteConfig.business.region,
    postalCode: siteConfig.business.postalCode,
    addressCountry: siteConfig.business.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.business.coordinates.latitude,
    longitude: siteConfig.business.coordinates.longitude,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Arequipa",
    },
    {
      "@type": "State",
      name: "Región de Arequipa",
    },
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.coordinates.latitude,
      longitude: siteConfig.business.coordinates.longitude,
    },
    geoRadius: "50000",
  },
  priceRange: "S/49 - S/149",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  currenciesAccepted: "PEN",
  openingHours: "Mo-Sa 08:00-20:00",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios Técnicos",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Soporte Técnico Remoto",
          description: "Asistencia técnica inmediata sin salir de casa",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mantenimiento Físico y Lógico",
          description: "Mantenimiento preventivo y mejora de rendimiento",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Reparación Avanzada",
          description:
            "Reparación electrónica y recuperación a nivel de componente",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "4",
    bestRating: "5",
    worstRating: "1",
  },
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Sr. Lucio",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      reviewBody:
        "Solicité el servicio a domicilio y quedé sorprendido con la puntualidad y profesionalismo. Me hicieron mantenimiento, revisión de la tarjeta gráfica e instalación de programas.",
      datePublished: "2025-01-15",
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Javier Montoya",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      reviewBody:
        "Me hicieron el mantenimiento completo de mi laptop, además de actualizarla de Windows 10 a Windows 11 y ampliar el almacenamiento con un SSD y más RAM.",
      datePublished: "2025-01-10",
    },
  ],
  sameAs: [
    "https://x.com/RenovaBit",
    "https://www.facebook.com/renovabit",
    "https://www.instagram.com/renovabit_arequipa",
    "https://www.tiktok.com/@renovabit",
  ],
};

// JSON-LD para WebSite
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: {
    "@id": `${siteConfig.url}#business`,
  },
  potentialAction: [
    {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  ],
};

// JSON-LD para Organization
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}#organization`,
  name: siteConfig.business.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo/ts/dark/horizontal.svg`,
  description: siteConfig.description,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.business.phone,
    contactType: "Customer Service",
    availableLanguage: "Spanish",
    areaServed: "PE",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Goyeneche 1602",
    addressLocality: siteConfig.business.city,
    addressRegion: siteConfig.business.region,
    postalCode: siteConfig.business.postalCode,
    addressCountry: siteConfig.business.country,
  },
  founder: {
    "@type": "Person",
    name: "Reyser Zapata",
  },
  foundingDate: "2025",
  knowsAbout: siteConfig.services,
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.coordinates.latitude,
      longitude: siteConfig.business.coordinates.longitude,
    },
    geoRadius: "50000",
  },
};
