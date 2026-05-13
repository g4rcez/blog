import { buildRss } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
    return new Response(buildRss("pt-BR"), {
        headers: {
            "content-type": "application/rss+xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
