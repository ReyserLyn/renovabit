import { contact, socialLinks } from "@renovabit/shared/src/config/links";
import {
  FacebookIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@renovabit/ui/src/components/icons";

import { AnimatedGridPattern } from "@renovabit/ui/src/components/magicui/animated-grid-pattern";
import { Highlighter } from "@renovabit/ui/src/components/magicui/highlighter";
import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import { Button } from "@renovabit/ui/src/components/ui/button";
import { cn } from "@renovabit/ui/src/utils/cn";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "./common/social-link";

export default function Hero() {
  const logoNeonStyleDark = {
    filter:
      "drop-shadow(0 0 8px rgba(139, 92, 246, 1)) drop-shadow(0 0 16px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 24px rgba(192, 132, 252, 0.8)) drop-shadow(0 0 32px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.4))",
  };

  const logoNeonStyleLight = {
    filter:
      "drop-shadow(0 0 6px rgba(101, 79, 204, 0.4)) drop-shadow(0 0 12px rgba(101, 79, 204, 0.3)) drop-shadow(0 0 18px rgba(101, 79, 204, 0.2)) drop-shadow(0 0 24px rgba(101, 79, 204, 0.15))",
  };

  const buttonClasses =
    "w-44 xl:w-64 text-base xl:text-lg h-10 xl:h-12 px-4 xl:px-6";
  const neonBackgroundStyle = {
    background: "linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc)",
    borderRadius: "12px",
  };

  const heroSocialLinks = [
    { icon: WhatsAppIcon, name: "WhatsApp", href: socialLinks.whatsapp },
    { icon: FacebookIcon, name: "Facebook", href: socialLinks.facebook },
    { icon: TikTokIcon, name: "TikTok", href: socialLinks.tiktok },
  ];

  const heroContent = (
    <>
      <div>
        {/* Título con efecto neon */}
        <div className="relative">
          <h1 className="absolute inset-0 text-2xl font-bold text-center text-primary/60 blur-lg md:text-3xl lg:text-4xl lg:text-secondary/60 dark:lg:text-primary/60 xl:text-5xl 2xl:text-6xl [@media(max-height:750px)]:text-primary/60">
            Servicio Técnico
          </h1>
          <h1 className="relative text-2xl font-bold text-center text-primary drop-shadow-2xl md:text-3xl lg:text-4xl lg:text-secondary dark:lg:text-primary xl:text-5xl 2xl:text-6xl [@media(max-height:750px)]:text-primary [@media(max-height:750px)]:drop-shadow-none">
            Servicio Técnico
          </h1>
        </div>

        {/* Logo con efecto neon */}
        <div className="relative my-3 2xl:my-8">
          <div
            className="absolute inset-0 opacity-10 blur-2xl"
            style={{
              ...neonBackgroundStyle,
              filter: "brightness(1.5) saturate(1.5)",
            }}
          />
          <div
            className="absolute inset-0 opacity-20 blur-lg"
            style={{
              ...neonBackgroundStyle,
              background: "linear-gradient(45deg, #7c3aed, #8b5cf6, #a855f7)",
            }}
          />

          {/* Logo light */}
          <Image
            src="/logo/ts/light/horizontal.svg"
            alt="RenovaBit - Servicio Técnico de Laptops y PCs en Arequipa, reparación a domicilio"
            width={600}
            height={146}
            priority={true}
            className="relative mx-auto object-cover w-[300px] sm:w-[400px] rounded-xl lg:w-[500px] xl:w-[600px] block lg:hidden dark:hidden [@media(max-height:750px)]:block [@media(max-height:750px)]:dark:hidden"
            style={logoNeonStyleLight}
          />

          {/* Logo dark */}
          <Image
            src="/logo/ts/dark/horizontal.svg"
            alt="RenovaBit - Servicio Técnico de Laptops y PCs en Arequipa, reparación a domicilio"
            width={600}
            height={146}
            priority={true}
            className="relative mx-auto object-cover w-[300px] sm:w-[400px] rounded-xl lg:w-[500px] xl:w-[600px] hidden lg:block dark:block [@media(max-height:750px)]:hidden [@media(max-height:750px)]:dark:block"
            style={logoNeonStyleDark}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative flex flex-col items-center justify-center gap-4 lg:gap-3 xl:gap-6">
        <p className="px-4 text-base text-center max-w-sm sm:text-accent dark:sm:text-accent-foreground md:text-lg lg:text-xl lg:max-w-lg xl:max-w-xl [@media(max-height:750px)]:text-foreground">
          "Reparamos tu laptop, mejoramos tu equipo y{" "}
          <Highlighter action="highlight" color="#654fcc">
            <span className="text-accent dark:text-accent-foreground">
              cuidamos tu inversión
            </span>
          </Highlighter>{" "}
          con la más{" "}
          <Highlighter action="underline" color="#cec7ff">
            alta calidad
          </Highlighter>
        </p>

        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 xl:gap-6">
          <Button
            className={buttonClasses}
            effect="expandIconRing"
            icon={MessageCircle}
            iconPlacement="right"
            asChild
          >
            <Link href={socialLinks.whatsapp}>Contáctanos</Link>
          </Button>
          <Button
            variant="outline"
            className={buttonClasses}
            effect="expandIconRing"
            icon={ArrowRight}
            iconPlacement="right"
            asChild
          >
            <Link href="/#todos-los-servicios">Ver servicios</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4">
          <SocialLinks socialLinks={heroSocialLinks} />
          <span className="text-lg font-bold sm:text-accent dark:sm:text-accent-foreground xl:text-2xl [@media(max-height:750px)]:text-foreground ">
            <Highlighter action="box" color="#654fcc">
              <Link
                href={socialLinks.whatsapp}
                className="hover:text-primary-foreground dark:hover:text-secondary-foreground"
              >
                {contact.phone}
              </Link>
            </Highlighter>
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="container min-h-[calc(100vh-300px)] sm:min-h-screen">
      {/* Circulos decorativos con blur */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-purple-500/55 dark:bg-primary/50 rounded-full blur-3xl animate-pulse" />

        <div className="absolute top-7/10 right-1/4 w-30 h-30 md:w-40 md:h-40 lg:w-56 lg:h-56 bg-purple-400/45 dark:bg-secondary/40 rounded-full blur-2xl animate-pulse [animation-delay:1s]" />

        <div className="absolute top-1/2 right-1/6 w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-violet-400/40 dark:bg-accent/35 rounded-full blur-xl animate-pulse [animation-delay:2s]" />

        <div className="absolute top-3/4 left-1/6 w-32 h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 bg-purple-300/45 dark:bg-muted/45 rounded-full blur-lg animate-pulse [animation-delay:0.5s]" />
      </div>

      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 z-0",
          "[mask-image:radial-gradient(350px_circle_at_center,white,transparent)]",
          "md:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "xl:[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "h-full w-full skew-y-12",
        )}
      />

      {/* Laptop background - Solo visible en pantallas sm+ */}
      <div className="absolute inset-0 z-0 container items-center justify-center hidden sm:flex [@media(max-height:750px)]:hidden">
        <div className="w-full max-w-[1440px] px-4 mx-auto">
          <AspectRatio ratio={16 / 10}>
            <Image
              src="/images/hero/laptop.webp"
              alt="Laptop moderna siendo reparada por técnicos especializados de RenovaBit en Arequipa"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1440px"
              className="object-cover rounded-2xl md:translate-y-[35px] [filter:drop-shadow(0_10px_20px_rgba(88,28,135,0.6))] dark:[filter:drop-shadow(0_10px_20px_rgba(109,40,217,0.4))]"
              style={{
                transform: "translateX(6px)",
              }}
            />
          </AspectRatio>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-start md:justify-center min-h-[calc(100vh-300px)] md:min-h-screen gap-5 sm:gap-20 lg:gap-0 py-8 md:py-0 md:translate-y-[-220px] lg:translate-y-[-125px] xl:translate-y-[-150px] [@media(max-height:750px)]:translate-y-0 [@media(max-height:750px)]:justify-start [@media(max-height:750px)]:mt-10">
        {/* Contenido para móvil (sm:hidden) */}
        <div className="flex flex-col items-center justify-center gap-5 sm:hidden">
          {heroContent}
        </div>

        {/* Contenido para desktop/tablet (hidden sm:flex) */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-5 sm:gap-20 lg:gap-0">
          {heroContent}
        </div>
      </div>
    </div>
  );
}
