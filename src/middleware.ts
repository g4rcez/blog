import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"],
};
