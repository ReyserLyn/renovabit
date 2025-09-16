/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || "https://www.renovabit.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.9,
  sitemapSize: 5000,
  exclude: [],

  // Configuración de robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Permitir específicamente a Googlebot
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 1,
      },
      // Permitir específicamente a Bingbot
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
    ],
    additionalSitemaps: [],
  },

  // Transformador personalizado para optimizar URLs
  transform: async (config, path) => {
    // Prioridades específicas por sección
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/") {
      priority = 1.0;
      changefreq = "weekly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },

  additionalPaths: async (_config) => [
    // await config.transform(config, '/servicios'),
    // await config.transform(config, '/contacto'),
  ],
};
