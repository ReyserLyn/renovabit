import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";

/** Tipo del icono: depende de @hugeicons/react; si cambian la API, revisar aquí. */
type HugeiconsIconProp = React.ComponentProps<typeof HugeiconsIcon>["icon"];

interface PrimaryActionButtonProps {
	icon: HugeiconsIconProp;
	children: React.ReactNode;
	onClick: () => void;
	className?: string;
}

/**
 * CTA principal del PageHeader: icono + texto, estilo unificado.
 */
export function PrimaryActionButton({
	icon: Icon,
	children,
	onClick,
	className,
}: PrimaryActionButtonProps) {
	return (
		<Button onClick={onClick} className={className}>
			<HugeiconsIcon icon={Icon} className="mr-2 size-4" />
			{children}
		</Button>
	);
}
