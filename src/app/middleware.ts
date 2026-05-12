import { NextResponse, type NextRequest } from "next/server";

const locales = ["en-US", "pt"];

const getLocale = (request: NextRequest) => {
    const url = new URL(request.url);
    return url.searchParams.get("lang") || "en-US";
};

export function middleware(request: NextRequest) {
    request.headers.set("x-url", request.url);
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
    if (pathnameHasLocale) return NextResponse.next();
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ["/((?!_next).*)"],
};
