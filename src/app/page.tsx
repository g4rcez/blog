import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { getPosts } from "@/components/server/posts";
import { WelcomePosts } from "@/components/welcome-posts";
import { absoluteUrl, DEFAULT_OG_IMAGE, homeCopy, homeKeywords, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const generateMetadata = async (props: any): Promise<Metadata> => {
    const search = await props.searchParams;
    const q = Array.isArray(search?.q) ? search?.q[0] : search?.q;
    const hasQuery = typeof q === "string" && q.length > 0;
    const copy = homeCopy["en-US"];
    return {
        title: hasQuery ? `Search: ${q}` : copy.title,
        description: copy.description,
        keywords: homeKeywords["en-US"],
        alternates: {
            canonical: "/",
            languages: { "en-US": "/", "pt-BR": "/pt", "x-default": "/" },
        },
        robots: hasQuery
            ? { index: false, follow: true }
            : {
                  index: true,
                  follow: true,
                  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
              },
        openGraph: {
            type: "website",
            url: SITE_URL,
            siteName: BlogConfig.name["en-US"],
            title: copy.title,
            description: copy.description,
            locale: "en_US",
            alternateLocale: ["pt_BR"],
            images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: BlogConfig.user.name }],
        },
        twitter: {
            card: "summary_large_image",
            site: "@garcez_allan",
            creator: "@garcez_allan",
            title: copy.title,
            description: copy.description,
            images: [DEFAULT_OG_IMAGE],
        },
    };
};

export default async function IndexPage(props: any) {
    const search = await props.searchParams;
    const q = search?.q || "";
    const value = Array.isArray(q) ? q[0] : q;
    const posts = getPosts(BlogConfig.defaultLanguage);
    const blogJsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${SITE_URL}/#blog`,
        url: SITE_URL,
        name: BlogConfig.name["en-US"],
        description: homeCopy["en-US"].description,
        inLanguage: "en-US",
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.info.title,
            description: p.info.description,
            url: absoluteUrl(p.href),
            datePublished: p.date,
            inLanguage: "en-US",
            keywords: p.info.subjects.join(", "),
            author: { "@id": `${SITE_URL}/#person` },
        })),
    };
    return (
        <>
            <JsonLd data={blogJsonLd} />
            <WelcomePosts lang={BlogConfig.defaultLanguage} q={value} />
        </>
    );
}
