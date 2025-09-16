"use client";

import { socialLinks } from "@renovabit/shared/src/config/links";
import { AnimatedThemeToggler } from "@renovabit/ui/src/components/magicui/animated-theme-toggler";
import { Button } from "@renovabit/ui/src/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { navItems } from "./nav-items";
import { NavButton } from "./navbar-button";

export default function NavbarMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <>
      <div className="md:hidden flex gap-2 items-center justify-center">
        <div className="w-9 h-9 flex items-center justify-center">
          <AnimatedThemeToggler size={20} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-5">
            <Menu
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                isMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
              }`}
            />
            <X
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
              }`}
            />
          </div>
        </Button>
      </div>
      <div
        className={`absolute top-full left-0 right-0 mt-3 mx-4 bg-background/98 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl z-50 md:hidden transition-all duration-500 ease-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 -translate-y-4 pointer-events-none scale-95"
        }`}
      >
        <div className="p-6 space-y-1">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                href={item.href}
                label={item.label}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
          </div>

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-300 rounded-xl h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02]"
            onClick={() => setIsMenuOpen(false)}
            asChild
          >
            <Link href={socialLinks.whatsapp}>Contáctanos</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
