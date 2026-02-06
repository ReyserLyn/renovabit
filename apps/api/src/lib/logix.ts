import logixlysia from "logixlysia";

const isProd = process.env.NODE_ENV === "production";

export const logixPlugin = logixlysia({
	config: {
		showStartupMessage: true,
		startupMessageFormat: isProd ? "simple" : "banner",
		useColors: !isProd,
		ip: true,
		disableInternalLogger: false,
		timestamp: { translateTime: "mm-dd-yyyy HH:MM:ss" },
		customLogFormat:
			"[+] {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
		logFilePath: "./logs/api.log",
		...(isProd && {
			logRotation: {
				maxSize: "100m",
				interval: "1d",
				maxFiles: "30d",
				compress: true,
			},
		}),
	},
});
