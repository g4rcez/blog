import { jsonHeaders, productUiEngineerSkillDigest } from "@/lib/agent-discovery";
import { agentSkills } from "@/lib/agent-skills";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    return Response.json(
        {
            $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
            skills: agentSkills.map(({ name, type, description, href }) => ({
                name,
                type,
                description,
                url: `${SITE_URL}${href}`,
                digest: productUiEngineerSkillDigest,
            })),
        },
        { headers: jsonHeaders },
    );
}
