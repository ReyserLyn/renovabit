import type { Metadata } from "next";
import "@renovabit/ui/styles/globals.css";
import { Toaster } from "@renovabit/ui/components/ui/sonner";
import { Outfit } from "next/font/google";
import { API_URL } from "@/lib/api/client";
import { Providers } from "@/providers/query-provider";

const outfit = Outfit({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Renovabit Store",
	description: "Renovabit Store",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [_categoriesNavbar, _brands] = await Promise.all([
		fetch(`${API_URL}/api/v1/categories/navbar`, {
			next: { revalidate: 3600 },
		})
			.then((res) => {
				if (!res.ok) {
					console.error("Failed to fetch categories navbar:", res.statusText);
					return null;
				}
				return res.json();
			})
			.catch((error) => {
				console.error("Error fetching categories navbar:", error);
				return null;
			}),
		fetch(`${API_URL}/api/v1/brands`, {
			next: { revalidate: 3600 }, // Revalida cada hora
		})
			.then((res) => {
				if (!res.ok) {
					console.error("Failed to fetch brands:", res.statusText);
					return null;
				}
				return res.json();
			})
			.catch((error) => {
				console.error("Error fetching brands:", error);
				return null;
			}),
	]);

	return (
		<html lang="es" suppressHydrationWarning>
			<body className={outfit.className}>
				<Providers>
					<Toaster />
					{children}
				</Providers>
			</body>
		</html>
	);
}
