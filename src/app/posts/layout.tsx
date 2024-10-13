import { BlogConfig } from "@/blog.config";
import { getPosts } from "@/components/server/list-posts";
import { Metadata } from "next";

export const getPathnameFromMetadataState = (state: any): string => {
    const res = Object.getOwnPropertySymbols(state || {})
        .map((p) => state[p])
        .find((state) => state?.hasOwnProperty?.("urlPathname"));
    return res?.urlPathname.replace(/\?.+/, "") || "";
};

const posts = getPosts();

export async function generateMetadata(_: any, parent: any): Promise<Metadata> {
    const name = getPathnameFromMetadataState(parent);
    const post = posts.find((x) => x.href === name);
    if (!post) return {};
    return {
        title: post.info.title,
        authors: [{ name: BlogConfig.author, url: BlogConfig.author }],
        description: post.info.description,
        creator: BlogConfig.author,
        keywords: post.info.subjects,
        twitter: { description: post.info.description, title: post.info.title, site: BlogConfig.site },
        openGraph: {
            type: "article",
            authors: BlogConfig.author,
            description: post.info.description,
            locale: post.info.language,
            tags: post.info.subjects,
            publishedTime: post.date,
            siteName: BlogConfig.name,
            title: post.info.title,
        },
    };
}
export default function PostsLayout(props: any) {
    return props.children;
}
