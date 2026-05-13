import { BlogConfig } from "@/blog.config";
import { getPosts } from "@/components/server/posts";
import { Locale } from "@/lib/dictionary";
import { absoluteUrl, DEFAULT_OG_IMAGE, languageAlternates, ogLocale, SITE_URL } from "@/lib/seo";
import { Metadata } from "next";

const getPathnameFromMetadataState = (state: any): string => {
    const res = Object.getOwnPropertySymbols(state || {})
        .map((p) => state[p])
        .find((state) => state?.hasOwnProperty?.("urlPathname"));
    return res?.urlPathname.replace(/\?.+/, "") || "";
};

export const createGenerateMetadata =
    (lang: Locale) =>
    async (_: any, parent: any): Promise<Metadata> => {
        const fullPath = getPathnameFromMetadataState(parent);
        const cleanHref = lang === "pt-BR" ? fullPath.replace(/^\/pt/, "") : fullPath;
        const posts = getPosts(lang);
        const post = posts.find((x) => x.href === cleanHref);
        if (!post) return {};
        const canonical = lang === "pt-BR" ? `/pt${post.href}` : post.href;
        const alternates = languageAlternates(post.info.translations, post.href);
        const ogImage = DEFAULT_OG_IMAGE;
        const siteName = BlogConfig.name[lang];
        const fullUrl = absoluteUrl(canonical);
        return {
            title: post.info.title,
            description: post.info.description,
            keywords: post.info.subjects,
            authors: [{ name: BlogConfig.user.name, url: SITE_URL }],
            creator: BlogConfig.user.name,
            publisher: BlogConfig.user.name,
            category: post.info.subjects[0],
            alternates: { canonical, languages: alternates },
            robots: {
                index: true,
                follow: true,
                googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
            },
            openGraph: {
                type: "article",
                url: fullUrl,
                siteName,
                title: post.info.title,
                description: post.info.description,
                locale: ogLocale[lang],
                publishedTime: post.date,
                modifiedTime: post.info.dateModified || post.date,
                authors: [SITE_URL],
                tags: post.info.subjects,
                images: [{ url: ogImage, width: 1200, height: 630, alt: post.info.title }],
            },
            twitter: {
                card: "summary_large_image",
                site: "@garcez_allan",
                creator: "@garcez_allan",
                title: post.info.title,
                description: post.info.description,
                images: [ogImage],
            },
        };
    };
