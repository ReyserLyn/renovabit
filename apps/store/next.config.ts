import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	allowedDevOrigins: ["localhost"],
	transpilePackages: ["@renovabit/ui"],
};
export default nextConfig;
