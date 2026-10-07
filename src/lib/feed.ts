import { BlogConfig } from "@/blog.config";
import { getPosts } from "@/components/server/posts";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { absoluteUrl, postPath } from "@/lib/seo";

const escapeXml = (s: string): string =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

export const buildRss = (lang: Locale): string => {
    const posts = getPosts(lang);
    const copy = getTranslation(lang);
    const homeUrl = absoluteUrl(postPath(lang, ""));
    const feedUrl = absoluteUrl(postPath(lang, "/feed.xml"));
    const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();
    const items = posts
        .map((p) => {
            const url = absoluteUrl(postPath(lang, p.href));
            return `    <item>
      <title>${escapeXml(p.info.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.info.description)}</description>
      ${p.info.subjects.map((s) => `<category>${escapeXml(s)}</category>`).join("\n      ")}
    </item>`;
        })
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BlogConfig.name[lang])}</title>
    <link>${homeUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(copy.feed.description)}</description>
    <language>${lang}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;
};
