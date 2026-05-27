import { jsonHeaders } from "@/lib/agent-discovery";

export const dynamic = "force-static";

export function GET() {
    return Response.json({ keys: [] }, { headers: jsonHeaders });
}
