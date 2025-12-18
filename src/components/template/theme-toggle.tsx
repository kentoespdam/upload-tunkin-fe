"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Switch } from "../ui/switch";

const ThemeToggle = () => {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	// Use resolvedTheme when available (handles `system`), and avoid local state for theme
	const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : false;

	const handleChange = useCallback(
		(checked: boolean) => {
			setTheme(checked ? "dark" : "light");
		},
		[setTheme],
	);

	return (
		<div className="flex items-center space-x-2">
			<span className="text-sm">Dark Mode</span>
			<Switch
				checked={isDark}
				onCheckedChange={handleChange}
				aria-label="Toggle theme"
			/>
			{isDark ? (
				<SunIcon className="h-5 w-5" />
			) : (
				<MoonIcon className="h-5 w-5" />
			)}
		</div>
	);
};

export default ThemeToggle;
