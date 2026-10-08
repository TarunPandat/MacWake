// /sitemap.xml for Google Search Console. One page, so one entry.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://macwake.vercel.app";

export default function sitemap() {
  return [{ url: `${SITE}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
