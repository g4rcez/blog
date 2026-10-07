import { localeFromPath, localizedPath, removeLocalePath } from "@/lib/seo";
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

const isMarkdownRequest = (request: NextRequest, pathname: string) =>
    acceptsMarkdown(request) || pathname.endsWith(".md");

const markdownPath = (pathname: string) => {
    const locale = localeFromPath(pathname);
    if (removeLocalePath(locale, pathname) === "/") return localizedPath(locale, "/markdown");
    if (pathname.endsWith(".md")) return `/markdown-content${pathname.slice(0, -3) || "/"}`;

    return `/markdown-content${pathname}`;
};

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const acceptedMarkdownPath = isMarkdownRequest(request, pathname) ? markdownPath(pathname) : null;
    const response = acceptedMarkdownPath
        ? NextResponse.rewrite(new URL(acceptedMarkdownPath, request.url))
        : NextResponse.next();

    response.headers.set("x-pathname", request.nextUrl.pathname);
    response.headers.set("vary", "Accept");

    const locale = localeFromPath(pathname);
    if (removeLocalePath(locale, pathname) === "/") {
        response.headers.set("link", discoveryLinks);
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)", "/:path*.md"],
};
