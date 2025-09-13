"use client";

import { Button } from "@renovabit/ui/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-4 z-40 mx-4 my-2 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-2xl shadow-lg flex items-center justify-between">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo/ts/light/horizontal.webp"
          alt="RenovaBit Logo"
          width={165.16}
          height={40}
          className="h-8 w-auto md:h-10"
        />
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="text-foreground hover:text-primary transition-colors"
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>

      <div className="hidden md:block">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Contáctanos
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-9 w-9"
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

      {/* Mobile Menu Overlay */}
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
          >
            Contáctanos
          </Button>
        </div>
      </div>
    </nav>
  );
}

const NavButton = ({
  href,
  label,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) => (
  <Button
    variant="ghost"
    className={`w-full justify-start text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-xl h-12 text-base font-medium ${className}`}
    onClick={onClick}
  >
    <Link href={href} className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-primary/60"></div>
      {label}
    </Link>
  </Button>
);
