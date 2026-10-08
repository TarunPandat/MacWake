// /robots.txt: crawl everything, and here's the sitemap.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://macwake.vercel.app";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE}/sitemap.xml` };
}
