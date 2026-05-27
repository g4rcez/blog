import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    const body = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /*?q=",
        "Disallow: /api/",
        "Content-Signal: ai-train=no, search=yes, ai-input=no",
        "",
        "User-agent: GPTBot",
        "Allow: /",
        "Content-Signal: ai-train=no, search=yes, ai-input=no",
        "",
        "User-agent: ClaudeBot",
        "Allow: /",
        "Content-Signal: ai-train=no, search=yes, ai-input=no",
        "",
        "User-agent: PerplexityBot",
        "Allow: /",
        "Content-Signal: ai-train=no, search=yes, ai-input=no",
        "",
        "User-agent: Googlebot",
        "Allow: /",
        "Content-Signal: ai-train=no, search=yes, ai-input=no",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        `Host: ${SITE_URL}`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
