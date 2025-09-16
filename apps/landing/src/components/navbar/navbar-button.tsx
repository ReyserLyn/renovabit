import { Button } from "@renovabit/ui/src/components/ui/button";
import Link from "next/link";

export const NavButton = ({
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
