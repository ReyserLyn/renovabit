"use client";

import {
	ArrowRight01Icon,
	Cancel01Icon,
	Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@renovabit/ui/components/ui/input-group";
import { Kbd } from "@renovabit/ui/components/ui/kbd";
import { cn } from "@renovabit/ui/lib/utils";
// import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type InputSearchProps = {
	placeholder?: string;
	className?: string;
};

export default function InputSearch({
	placeholder = "Buscar productos...",
	className,
}: InputSearchProps) {
	const id = useId();
	// const router = useRouter();
	const [value, setValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const query = value.trim();
		if (!query) return;
		console.log(query);

		// Navega a la página de resultados
		//router.push(`/buscar?q=${encodeURIComponent(query)}`);
	};

	return (
		<form onSubmit={handleSearch} className={cn("w-full max-w-sm", className)}>
			<InputGroup className="h-10 bg-muted/50 border-transparent hover:bg-muted focus-within:bg-background transition-all duration-200">
				{/* Icono de búsqueda */}
				<InputGroupAddon className="text-muted-foreground group-focus-within/input-group:text-primary transition-colors duration-200">
					<HugeiconsIcon icon={Search01Icon} size={18} />
				</InputGroupAddon>

				{/* Input principal */}
				<InputGroupInput
					ref={inputRef}
					id={id}
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="h-full"
				/>

				{/* Acciones */}
				<InputGroupAddon align="inline-end" className="gap-1">
					{/* Botón para limpiar */}
					{value && (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							onClick={() => setValue("")}
							aria-label="Limpiar búsqueda"
						>
							<HugeiconsIcon icon={Cancel01Icon} size={14} />
						</Button>
					)}

					{/* Shortcut visual */}
					{!value && (
						<div className="hidden sm:flex items-center gap-1 opacity-60">
							<Kbd>Ctrl</Kbd>
							<Kbd>K</Kbd>
						</div>
					)}

					{/* Divisor visual si hay texto */}
					{value && <div className="w-px h-4 bg-border mx-0.5" />}

					{/* Botón de envío */}
					<InputGroupButton
						type="submit"
						size="icon-sm"
						variant={value ? "default" : "ghost"}
						aria-label="Buscar"
						disabled={!value}
					>
						<HugeiconsIcon icon={ArrowRight01Icon} size={18} />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
