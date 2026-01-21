import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/vendas", "/login", "/signup", "/privacidade", "/termos"],
      disallow: ["/dashboard", "/novo-processo", "/processo", "/job", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

