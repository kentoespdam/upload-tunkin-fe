"use client";

import { Toaster } from "sonner";
import ThemeProvider from "@/components/template/theme-provider";

const Template = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
};

export default Template;
