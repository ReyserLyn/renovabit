/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || "https://www.renovabit.com",
  generateRobotsTxt: false,
  trailingSlash: false,
  changefreq: "weekly",
  priority: 0.9,
  sitemapSize: 5000,
  exclude: [],
  generateIndexSitemap: false,

  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    }

    return {
      loc: `${config.siteUrl}${path}`,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (_config) => [],
};
