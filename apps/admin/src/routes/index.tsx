import { Button } from "@renovabit/ui/components/ui/button.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="text-center">
				<h1 className="mb-4 font-bold text-4xl text-gray-900">
					Admin Dashboard
				</h1>
				<p className="text-gray-600">Welcome to your admin panel</p>
				<Button>Test Button</Button>
			</div>
		</div>
	);
}
