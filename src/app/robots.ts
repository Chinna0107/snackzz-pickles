import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image"],
        disallow: ["/admin", "/dashboard", "/api", "/checkout", "/cart"],
      },
    ],
    sitemap: "https://snakzee.com/sitemap.xml",
    host: "https://snakzee.com",
  };
}
