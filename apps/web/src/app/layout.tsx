import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const fredoka = Fredoka({
	variable: "--font-fredoka",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const nunito = Nunito({
	variable: "--font-nunito",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "camp hedeetch",
	description: "Vote on your favorite Airbnb for our group vacation!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${fredoka.variable} ${nunito.variable} antialiased`}>
				<Providers>
					<div className="grid min-h-svh grid-rows-[auto_1fr]">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
