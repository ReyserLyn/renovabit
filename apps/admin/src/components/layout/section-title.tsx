import { cn } from "@renovabit/ui/lib/utils";

interface SectionTitleProps {
	children: React.ReactNode;
	className?: string;
	/** Si true, usa estilo más suave (muted) para secciones secundarias */
	muted?: boolean;
}

/**
 * Título de sección reutilizable para bloques dentro de una página
 * (ej. "Previsualización de estructura", "Filtros avanzados").
 */
export function SectionTitle({
	children,
	className,
	muted = true,
}: SectionTitleProps) {
	return (
		<h2
			className={cn(
				"text-lg font-semibold mb-4",
				muted ? "text-muted-foreground" : "text-foreground",
				className,
			)}
		>
			{children}
		</h2>
	);
}
