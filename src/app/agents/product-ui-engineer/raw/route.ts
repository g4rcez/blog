import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export function GET() {
    const filePath = path.join(process.cwd(), "src", "app", "agents", "product-ui-engineer", "page.md");
    const content = fs.readFileSync(filePath, "utf-8");
    return new Response(content, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
