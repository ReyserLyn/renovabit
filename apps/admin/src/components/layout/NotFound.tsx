import { Button } from "@renovabit/ui/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
			<h1 className="text-4xl font-bold text-muted-foreground">404</h1>
			<p className="text-muted-foreground">Página no encontrada</p>
			<Button
				nativeButton={false}
				variant="secondary"
				render={<Link to="/">Ir al inicio</Link>}
			/>
		</div>
	);
}
