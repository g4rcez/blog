import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { getPosts } from "@/components/server/posts";
import { Locale } from "@/lib/dictionary";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { headers } from "next/headers";

type Props = { lang: Locale };

export async function PostJsonLd({ lang }: Props) {
    const h = await headers();
    const pathname = h.get("x-pathname") || "";
    const cleanHref = lang === "pt-BR" ? pathname.replace(/^\/pt/, "") : pathname;
    const posts = getPosts(lang);
    const post = posts.find((x) => x.href === cleanHref);
    if (!post) return null;
    const canonical = lang === "pt-BR" ? `/pt${post.href}` : post.href;
    const fullUrl = absoluteUrl(canonical);
    const blogPosting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${fullUrl}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": fullUrl },
        headline: post.info.title,
        description: post.info.description,
        url: fullUrl,
        datePublished: post.date,
        dateModified: post.info.dateModified || post.date,
        inLanguage: lang,
        keywords: post.info.subjects.join(", "),
        articleSection: post.info.subjects[0],
        wordCount: post.wordCount,
        image: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE, width: 1200, height: 630 },
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": lang === "pt-BR" ? `${SITE_URL}/pt#blog` : `${SITE_URL}/#blog` },
    };
    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: BlogConfig.name[lang],
                item: lang === "pt-BR" ? `${SITE_URL}/pt` : SITE_URL,
            },
            { "@type": "ListItem", position: 2, name: post.info.title, item: fullUrl },
        ],
    };
    return <JsonLd data={[blogPosting, breadcrumb]} />;
}
