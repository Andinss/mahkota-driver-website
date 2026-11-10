import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mahkotadrive.com"; // Ganti dengan domain asli

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/dashboard"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
