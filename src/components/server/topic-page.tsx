import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { Posts } from "@/components/server/list-posts";
import { getTopicPosts } from "@/components/server/topics";
import { Locale } from "@/lib/dictionary";
import { absoluteUrl, SITE_URL, topicsBasePath } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = { lang: Locale; slug: string };

export async function TopicPage({ lang, slug }: Props) {
    const { topic, posts } = getTopicPosts(lang, slug);
    if (!topic) notFound();
    const base = topicsBasePath[lang];
    const homeUrl = lang === "pt-BR" ? `${SITE_URL}/pt` : SITE_URL;
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": absoluteUrl(`${base}/${slug}#page`),
        url: absoluteUrl(`${base}/${slug}`),
        name: topic.name,
        inLanguage: lang,
        isPartOf: { "@id": lang === "pt-BR" ? `${SITE_URL}/pt#blog` : `${SITE_URL}/#blog` },
        about: { "@type": "Thing", name: topic.name },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: absoluteUrl(lang === "pt-BR" ? `/pt${p.href}` : p.href),
                name: p.info.title,
            })),
        },
    };
    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: BlogConfig.name[lang], item: homeUrl },
            { "@type": "ListItem", position: 2, name: "Topics", item: absoluteUrl(base) },
            { "@type": "ListItem", position: 3, name: topic.name, item: absoluteUrl(`${base}/${slug}`) },
        ],
    };
    return (
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-12 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <JsonLd data={[collectionJsonLd, breadcrumb]} />
            <header className="mb-9 space-y-4">
                <p className="font-display text-sm font-medium text-secondary-foreground">Topic</p>
                <h1 className="font-display text-3xl tracking-tight text-foreground">{topic.name}</h1>
                <p className="font-display text-secondary-foreground">
                    {posts.length} {posts.length === 1 ? "article" : "articles"}
                </p>
            </header>
            <Posts lang={lang} posts={posts} search="" />
        </div>
    );
}
