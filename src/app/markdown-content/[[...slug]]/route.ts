import { createMarkdownRouteResponse } from "@/lib/markdown-routes";

export const dynamic = "force-static";

type Props = {
    params: Promise<{ slug?: string[] }>;
};

export async function GET(_request: Request, { params }: Props) {
    const { slug = [] } = await params;
    const routePath = `/${slug.join("/")}`;

    return createMarkdownRouteResponse(routePath);
}
