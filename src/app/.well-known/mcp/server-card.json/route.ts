import { jsonHeaders, siteName } from "@/lib/agent-discovery";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    return Response.json(
        {
            serverInfo: {
                name: siteName,
                version: "1.0.0",
            },
            endpoint: `${SITE_URL}/mcp`,
            transports: [
                {
                    type: "streamable-http",
                    endpoint: `${SITE_URL}/mcp`,
                },
            ],
            capabilities: {
                tools: {
                    listChanged: false,
                    available: ["search_posts", "read_agent_skill"],
                },
                resources: {
                    subscribe: false,
                    listChanged: false,
                    available: ["blog:home", "agent-skill:product-ui-engineer"],
                },
                prompts: { listChanged: false, available: [] },
            },
            documentation: `${SITE_URL}/auth.md`,
        },
        { headers: jsonHeaders },
    );
}
