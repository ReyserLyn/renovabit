import "@renovabit/ui/globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { StructuredData } from "@/components/seo/structured-data";
import { baseMetadata } from "@/config/seo";
import { ThemeProvider } from "@/providers/theme-provider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Datos estructurados JSON-LD */}
        <StructuredData />

        {/* Icon*/ }
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Verificaciones adicionales */}
        <meta
          name="google-site-verification"
          content="7Q5lqvjWHcpuMW3CdX9IfWbcj3bmTNC0GGb3-hdfbCE"
        />

        {/* Preconnect para mejorar rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Optimización para dispositivos móviles */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#8b5cf6" />

        {/* Open Graph Logo */}
        <meta
          property="og:logo"
          content="https://www.renovabit.com/logo/ts/dark/horizontal.svg"
        />

        {/* Geo tags para SEO local */}
        <meta name="geo.region" content="PE-ARE" />
        <meta name="geo.placename" content="Arequipa" />
        <meta name="geo.position" content="-16.409047;-71.537451" />
        <meta name="ICBM" content="-16.409047, -71.537451" />

        {/* Core Web Vitals y Performance */}
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />

        {/* Preload crítico para Core Web Vitals */}
        <link
          rel="preload"
          href="/images/hero/laptop-msi.avif"
          as="image"
          type="image/avif"
        />

        {/* Resource hints para PostHog */}
        <link rel="dns-prefetch" href="//us.posthog.com" />
        <link
          rel="preconnect"
          href="https://us.posthog.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${outfit.className} ${outfit.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
