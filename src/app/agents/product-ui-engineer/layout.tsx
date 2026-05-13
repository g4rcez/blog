import { BlogConfig } from "@/blog.config";
import { getPageFrontmatter } from "@/lib/page-frontmatter";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";

const PATH = "/agents/product-ui-engineer";
const fm = getPageFrontmatter(PATH);
const URL = absoluteUrl(PATH);

export const metadata: Metadata = {
    title: fm.title,
    description: fm.description,
    keywords: fm.subjects,
    alternates: {
        canonical: PATH,
        languages: { "en-US": URL, "x-default": URL },
    },
    openGraph: {
        type: "article",
        url: URL,
        siteName: BlogConfig.name["en-US"],
        title: fm.title,
        description: fm.description,
        locale: "en_US",
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: fm.title }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@garcez_allan",
        creator: "@garcez_allan",
        title: fm.title,
        description: fm.description,
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function AgentLayout({ children }: PropsWithChildren) {
    return children;
}
