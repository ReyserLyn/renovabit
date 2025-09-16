import Link from "next/link";

interface SocialLinkProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  href: string;
}

export function SocialLinks({
  className = "",
  socialLinks,
}: {
  className?: string;
  socialLinks: SocialLinkProps[];
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {socialLinks.map(({ icon: Icon, name, href }, idx) => (
        <Link
          key={idx}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={name}
          className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
        >
          <Icon className="w-4.5 h-4.5" />
        </Link>
      ))}
    </div>
  );
}
