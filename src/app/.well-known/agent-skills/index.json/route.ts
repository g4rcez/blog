import { jsonHeaders, productUiEngineerSkillDigest } from "@/lib/agent-discovery";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
    return Response.json(
        {
            $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
            skills: [
                {
                    name: "product-ui-engineer",
                    type: "skill-md",
                    description:
                        "A product-minded UI engineering agent skill for reviewing frontend states, accessibility, and UX details before implementation.",
                    url: `${SITE_URL}/.well-known/agent-skills/product-ui-engineer/SKILL.md`,
                    digest: productUiEngineerSkillDigest,
                },
            ],
        },
        { headers: jsonHeaders },
    );
}
