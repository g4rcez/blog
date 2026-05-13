import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { getPosts } from "@/components/server/posts";
import { WelcomePosts } from "@/components/welcome-posts";
import { absoluteUrl, DEFAULT_OG_IMAGE, homeCopy, homeKeywords, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

const lang = "pt-BR";

export const generateMetadata = async (props: any): Promise<Metadata> => {
    const search = await props.searchParams;
    const q = Array.isArray(search?.q) ? search?.q[0] : search?.q;
    const hasQuery = typeof q === "string" && q.length > 0;
    const copy = homeCopy["pt-BR"];
    return {
        title: hasQuery ? `Busca: ${q}` : copy.title,
        description: copy.description,
        keywords: homeKeywords["pt-BR"],
        alternates: {
            canonical: "/pt",
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
            url: `${SITE_URL}/pt`,
            siteName: BlogConfig.name["pt-BR"],
            title: copy.title,
            description: copy.description,
            locale: "pt_BR",
            alternateLocale: ["en_US"],
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
    const posts = getPosts(lang);
    const blogJsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${SITE_URL}/pt#blog`,
        url: `${SITE_URL}/pt`,
        name: BlogConfig.name["pt-BR"],
        description: homeCopy["pt-BR"].description,
        inLanguage: "pt-BR",
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.info.title,
            description: p.info.description,
            url: absoluteUrl(`/pt${p.href}`),
            datePublished: p.date,
            inLanguage: "pt-BR",
            keywords: p.info.subjects.join(", "),
            author: { "@id": `${SITE_URL}/#person` },
        })),
    };
    return (
        <>
            <JsonLd data={blogJsonLd} />
            <WelcomePosts lang={lang} q={value} />
        </>
    );
}
