import { jsonHeaders } from "@/lib/agent-discovery";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    return Response.json(
        {
            issuer: SITE_URL,
            authorization_endpoint: `${SITE_URL}/agent/auth/authorize`,
            token_endpoint: `${SITE_URL}/agent/auth/token`,
            jwks_uri: `${SITE_URL}/.well-known/jwks.json`,
            grant_types_supported: [],
            response_types_supported: [],
            scopes_supported: ["public:read"],
            token_endpoint_auth_methods_supported: [],
            service_documentation: `${SITE_URL}/auth.md`,
            agent_auth: {
                skill: `${SITE_URL}/auth.md`,
                register_uri: `${SITE_URL}/agent/auth/register`,
                identity_types_supported: ["anonymous"],
                anonymous: {
                    credential_types_supported: [],
                    claim_uri: `${SITE_URL}/auth.md`,
                },
            },
        },
        { headers: jsonHeaders },
    );
}
