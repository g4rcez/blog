import { BlogConfig } from "@/blog.config";
import { getPosts } from "@/components/server/posts";
import { Locale } from "@/lib/dictionary";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

const escape = (s: string): string =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

export const buildRss = (lang: Locale): string => {
    const posts = getPosts(lang);
    const homeUrl = lang === "pt-BR" ? `${SITE_URL}/pt` : SITE_URL;
    const feedUrl = lang === "pt-BR" ? `${SITE_URL}/pt/feed.xml` : `${SITE_URL}/feed.xml`;
    const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();
    const items = posts
        .map((p) => {
            const url = absoluteUrl(lang === "pt-BR" ? `/pt${p.href}` : p.href);
            return `    <item>
      <title>${escape(p.info.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escape(p.info.description)}</description>
      ${p.info.subjects.map((s) => `<category>${escape(s)}</category>`).join("\n      ")}
    </item>`;
        })
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(BlogConfig.name[lang])}</title>
    <link>${homeUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escape(lang === "pt-BR" ? "Posts do Blog do Garcez" : "Posts from Garcez's Blog")}</description>
    <language>${lang}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;
};
