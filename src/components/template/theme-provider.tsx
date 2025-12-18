"use client";

import { ThemeProvider as NextThemeProvider } from "next-theme";
import type { ThemeProviderProps } from "next-theme/dist/provider/index.props";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return (
		<NextThemeProvider attribute="class" defaultTheme="system" {...props}>
			{children}
		</NextThemeProvider>
	);
};

export default ThemeProvider;
