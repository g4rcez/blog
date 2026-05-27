import { jsonHeaders } from "@/lib/agent-discovery";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    return Response.json(
        {
            resource: SITE_URL,
            authorization_servers: [SITE_URL],
            scopes_supported: ["public:read"],
            bearer_methods_supported: ["header"],
            resource_documentation: `${SITE_URL}/auth.md`,
        },
        { headers: jsonHeaders },
    );
}
