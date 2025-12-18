"use client";

import {
	ThemeProvider as NextThemeProvider,
	type ThemeProviderProps,
} from "next-themes";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};

export default ThemeProvider;
