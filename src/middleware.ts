import { NextResponse, type NextRequest } from "next/server";

const discoveryLinks = [
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
    '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"',
    '</auth.md>; rel="service-doc"; type="text/markdown"',
    '</markdown>; rel="alternate"; type="text/markdown"',
].join(", ");

const acceptsMarkdown = (request: NextRequest) =>
    request.headers.get("accept")?.toLowerCase().includes("text/markdown") ?? false;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const shouldReturnMarkdown = acceptsMarkdown(request) && (pathname === "/" || pathname === "/pt");
    const response = shouldReturnMarkdown
        ? NextResponse.rewrite(new URL(pathname === "/pt" ? "/pt/markdown" : "/markdown", request.url))
        : NextResponse.next();

    response.headers.set("x-pathname", request.nextUrl.pathname);
    response.headers.set("vary", "Accept");

    if (pathname === "/" || pathname === "/pt") {
        response.headers.set("link", discoveryLinks);
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"],
};
