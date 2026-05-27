import { productUiEngineerSkill } from "@/lib/agent-discovery";

export const dynamic = "force-static";

export function GET() {
    return new Response(productUiEngineerSkill, {
        headers: {
            "content-type": "text/markdown; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
