import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	turbopack: {},
	env: {
		DEFAULT_TIMEZONE: "Asia/Jakarta",
	},
	output: "standalone",
};

export default nextConfig;
