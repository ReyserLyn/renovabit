import type { Metadata } from "next";
import "@renovabit/ui/styles/globals.css";
import { Toaster } from "@renovabit/ui/components/ui/sonner";
import { Outfit } from "next/font/google";
import { Providers } from "@/providers/query-provider";

const outfit = Outfit({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Renovabit Store",
	description: "Renovabit Store",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
