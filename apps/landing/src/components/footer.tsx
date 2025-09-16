import { contact, socialLinks } from "@renovabit/shared/src/config/links";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
} from "@renovabit/ui/src/components/icons";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "./common/social-link";
import MapRenovaBit from "./footer/map";

const contactInfo = [
  {
    icon: Mail,
    label: "Email:",
    items: contact.emails.map((email) => ({
      value: email,
      href: `mailto:${email}`,
    })),
  },
  {
    icon: Phone,
    label: "Teléfono:",
    items: [
      {
        value: contact.phone,
        href: `tel:${contact.phone.replace(/\s/g, "")}`,
      },
    ],
  },
  {
    icon: MapPin,
    label: "Dirección:",
    items: [
      {
        value: contact.address.replace(", ", "\n"),
        href: `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`,
      },
    ],
  },
  {
    icon: Clock,
    label: "Horario:",
    items: [{ value: contact.hours, href: null }],
  },
];

const navigationLinks = [
  { href: "/", name: "Inicio" },
  { href: socialLinks.whatsapp, name: "Contacto" },
];

const footerSocialLinks = [
  { icon: FacebookIcon, name: "Facebook", href: socialLinks.facebook },
  { icon: InstagramIcon, name: "Instagram", href: socialLinks.instagram },
  { icon: TikTokIcon, name: "TikTok", href: socialLinks.tiktok },
  { icon: XIcon, name: "X", href: socialLinks.x },
  {
    icon: WhatsAppIcon,
    name: "WhatsApp",
    href: socialLinks.whatsapp,
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted/30 to-muted/10 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/ts/light/horizontal.svg"
                alt="RenovaBit Logo"
                width={300}
                height={73.44}
                className="block dark:hidden"
              />

              <Image
                src="/logo/ts/dark/horizontal.svg"
                alt="RenovaBit Logo"
                width={300}
                height={73.44}
                className="hidden dark:block"
              />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <nav className="flex flex-wrap gap-6">
              {navigationLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <SocialLinks socialLinks={footerSocialLinks} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Contáctenos en:
            </h3>
            <div className="space-y-3">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex items-center gap-2 w-20 flex-shrink-0">
                    <div className="w-4 h-4 text-primary flex-shrink-0">
                      <info.icon className="w-full h-full" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {info.label}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    {info.items.map((item, itemIdx) => (
                      <div key={itemIdx}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="inline text-sm text-foreground hover:text-primary transition-colors duration-200 whitespace-pre-line"
                          >
                            {item.value}
                          </Link>
                        ) : (
                          <span className="inline text-sm text-foreground whitespace-pre-line">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Redes sociales:
              </h4>
              <SocialLinks socialLinks={footerSocialLinks} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Ubicanos en:
            </h3>
            <div className="bg-card border border-border rounded-2xl h-64 overflow-hidden">
              <MapRenovaBit />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 RenovaBit – Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
