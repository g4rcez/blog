import { BlogConfig } from "@/blog.config";
import { getPosts } from "@/components/server/posts";
import { homeCopy, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    const posts = getPosts("en-US");
    const body = [
        `# ${homeCopy["en-US"].title}`,
        "",
        homeCopy["en-US"].description,
        "",
        `Author: ${BlogConfig.user.name}`,
        `Canonical: ${SITE_URL}`,
        "",
        "## Recent posts",
        "",
        ...posts
            .slice(0, 20)
            .map((post) => `- [${post.info.title}](${SITE_URL}${post.href}) — ${post.info.description}`),
        "",
        "## Agent resources",
        "",
        `- [Product UI Engineer](${SITE_URL}/agents/product-ui-engineer)`,
        `- [Agent skills index](${SITE_URL}/.well-known/agent-skills/index.json)`,
        `- [API catalog](${SITE_URL}/.well-known/api-catalog)`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: {
            "content-type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(Math.ceil(body.split(/\s+/).filter(Boolean).length * 1.35)),
            "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
