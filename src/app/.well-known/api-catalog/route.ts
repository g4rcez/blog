import { jsonHeaders } from "@/lib/agent-discovery";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    return Response.json(
        {
            linkset: [
                {
                    anchor: `${SITE_URL}/`,
                    "service-desc": [
                        {
                            href: `${SITE_URL}/.well-known/agent-skills/index.json`,
                            type: "application/json",
                        },
                    ],
                    "service-doc": [
                        { href: `${SITE_URL}/auth.md`, type: "text/markdown" },
                        { href: `${SITE_URL}/markdown`, type: "text/markdown", hreflang: "en-US" },
                        { href: `${SITE_URL}/pt/markdown`, type: "text/markdown", hreflang: "pt-BR" },
                    ],
                    status: [{ href: `${SITE_URL}/robots.txt`, type: "text/plain" }],
                },
                {
                    anchor: `${SITE_URL}/agents/product-ui-engineer`,
                    "service-desc": [
                        {
                            href: `${SITE_URL}/.well-known/agent-skills/product-ui-engineer/SKILL.md`,
                            type: "text/markdown",
                        },
                    ],
                    "service-doc": [{ href: `${SITE_URL}/agents/product-ui-engineer/raw`, type: "text/plain" }],
                    status: [{ href: `${SITE_URL}/agents/product-ui-engineer`, type: "text/html" }],
                },
            ],
        },
        { headers: { ...jsonHeaders, "content-type": "application/linkset+json; charset=utf-8" } },
    );
}
