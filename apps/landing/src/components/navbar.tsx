import { socialLinks } from "@renovabit/shared/src/config/links";
import { AnimatedThemeToggler } from "@renovabit/ui/components/magicui/animated-theme-toggler";
import { Button } from "@renovabit/ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./navbar/nav-items";
import NavbarMobile from "./navbar/navbar-mobile";

export default function Navbar() {
  return (
    <div className="container">
      <nav className="sticky top-4 z-40 mx-4 my-2 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-2xl shadow-lg flex items-center justify-between navbar-container">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/ts/dark/horizontal.svg"
            alt="RenovaBit Logo"
            width={165.16}
            height={40.19}
            className="hidden dark:block"
          />
          <Image
            src="/logo/ts/light/horizontal.svg"
            alt="RenovaBit Logo"
            width={165.16}
            height={40.19}
            className="dark:hidden"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="link"
              effect="hoverUnderline"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden md:flex gap-4 items-center justify-center">
          <AnimatedThemeToggler size={20} />

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            effect="shineHover"
            asChild
          >
            <Link href={socialLinks.whatsapp}>Contáctanos</Link>
          </Button>
        </div>

        <NavbarMobile />
      </nav>
    </div>
  );
}
