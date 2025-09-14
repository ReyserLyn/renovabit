import { Highlighter } from "@renovabit/ui/src/components/magicui/highlighter";
import { AspectRatio } from "@renovabit/ui/src/components/ui/aspect-ratio";
import { Button } from "@renovabit/ui/src/components/ui/button";
import Image from "next/image";

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
            alt="Logo Renovabit"
            width={600}
            height={85}
            className="relative mx-auto object-cover w-[300px] sm:w-[400px] rounded-xl lg:w-[500px] xl:w-[600px] block lg:hidden dark:hidden [@media(max-height:750px)]:block [@media(max-height:750px)]:dark:hidden"
            style={logoNeonStyleLight}
          />

          {/* Logo dark */}
          <Image
            src="/logo/ts/dark/horizontal.svg"
            alt="Logo Renovabit"
            width={600}
            height={85}
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
          <Button className={buttonClasses} effect="ringHover">
            Contáctanos
          </Button>
          <Button
            variant="outline"
            className={buttonClasses}
            effect="ringHover"
          >
            Ver servicios
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4">
          <div className="w-4 h-4 border border-primary rounded-full md:w-5 md:h-5"></div>
          <div className="w-4 h-4 border border-primary rounded-full md:w-5 md:h-5"></div>
          <div className="w-4 h-4 border border-primary rounded-full md:w-5 md:h-5"></div>
          <span className="text-lg font-bold sm:text-accent dark:sm:text-accent-foreground xl:text-2xl [@media(max-height:750px)]:text-foreground">
            <Highlighter action="box" color="#654fcc">
              987 471 074
            </Highlighter>
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="container min-h-[calc(100vh-300px)] sm:min-h-screen">
      {/* Laptop background - Solo visible en pantallas sm+ */}
      <div className="absolute inset-0 z-0 container items-center justify-center hidden sm:flex [@media(max-height:750px)]:hidden">
        <div className="w-full max-w-[1440px] px-4 mx-auto">
          <AspectRatio ratio={16 / 10}>
            <Image
              src="/images/hero/laptop.webp"
              alt="Laptop de fondo"
              fill
              className="object-cover rounded-2xl md:translate-y-[35px]"
              style={{ transform: "translateX(6px)" }}
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
