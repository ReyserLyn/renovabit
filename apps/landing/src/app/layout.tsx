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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RenovaBit" />
        <meta name="theme-color" content="#8b5cf6" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Open Graph Logo */}
        <meta
          property="og:logo"
          content="https://www.renovabit.com/logo/ts/dark/horizontal.svg"
        />

        {/* Iconos adicionales */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8b5cf6" />

        {/* Android Chrome */}
        <meta name="mobile-web-app-title" content="RenovaBit" />

        {/* Geo tags para SEO local */}
        <meta name="geo.region" content="PE-ARE" />
        <meta name="geo.placename" content="Arequipa" />
        <meta name="geo.position" content="-16.409047;-71.537451" />
        <meta name="ICBM" content="-16.409047, -71.537451" />
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
