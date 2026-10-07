import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { getPosts } from "@/components/server/posts";
import { WelcomePosts } from "@/components/welcome-posts";
import { absoluteUrl, DEFAULT_OG_IMAGE, homeCopy, homeKeywords, localizedAlternates, localeToPath, ogLocale, postPath, SITE_URL } from "@/lib/seo";
import { SUPPORTED_LOCALES } from "@/lib/dictionary";
import type { Metadata } from "next";

const lang = "pt-BR";
type HomePageProps = { searchParams: Promise<{ q?: string | string[] }> };

export const generateMetadata = async ({ searchParams }: HomePageProps): Promise<Metadata> => {
    const search = await searchParams;
    const q = Array.isArray(search.q) ? search.q[0] : search.q;
    const hasQuery = typeof q === "string" && q.length > 0;
    const copy = homeCopy[lang];
    return {
        title: hasQuery ? `Busca: ${q}` : copy.title,
        description: copy.description,
        keywords: homeKeywords[lang],
        alternates: {
            canonical: localeToPath[lang],
            languages: localizedAlternates(SUPPORTED_LOCALES, (locale) => localeToPath[locale]),
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
            url: absoluteUrl(localeToPath[lang]),
            siteName: BlogConfig.name[lang],
            title: copy.title,
            description: copy.description,
            locale: ogLocale[lang],
            alternateLocale: SUPPORTED_LOCALES.flatMap((locale) => (locale === lang ? [] : [ogLocale[locale]])),
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

export default async function IndexPage({ searchParams }: HomePageProps) {
    const search = await searchParams;
    const q = search.q || "";
    const value = Array.isArray(q) ? q[0] : q;
    const posts = getPosts(lang);
    const blogJsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${absoluteUrl(localeToPath[lang])}#blog`,
        url: absoluteUrl(localeToPath[lang]),
        name: BlogConfig.name[lang],
        description: homeCopy[lang].description,
        inLanguage: lang,
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.info.title,
            description: p.info.description,
            url: absoluteUrl(postPath(lang, p.href)),
            datePublished: p.date,
            inLanguage: lang,
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
