import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    const body = [
        "# auth.md",
        "",
        "Garcez's Blog does not require authentication for public content or agent-readable resources.",
        "",
        "## Agent access",
        "",
        "- Public pages, feeds, markdown representations, and discovery metadata are available without registration.",
        "- No protected API scopes are currently required.",
        "- If protected APIs are added later, OAuth metadata will be published through the well-known endpoints below.",
        "",
        "## Discovery endpoints",
        "",
        `- OAuth authorization server metadata: ${SITE_URL}/.well-known/oauth-authorization-server`,
        `- OAuth protected resource metadata: ${SITE_URL}/.well-known/oauth-protected-resource`,
        `- API catalog: ${SITE_URL}/.well-known/api-catalog`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "content-type": "text/markdown; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
