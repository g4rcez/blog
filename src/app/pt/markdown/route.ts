import { createMarkdownResponse, getHomeMarkdown } from "@/lib/markdown-routes";

export const dynamic = "force-static";

export function GET() {
    return createMarkdownResponse(getHomeMarkdown("pt-BR"));
}
