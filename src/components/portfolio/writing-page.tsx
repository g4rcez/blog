import { JsonLd } from "@/components/server/json-ld";
import { getPosts } from "@/components/server/posts";
import { portfolioCopy, portfolioPath } from "@/lib/portfolio";
import { absoluteUrl, postPath, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/dictionary";
import { PortfolioPage, WritingGrid } from "./portfolio-ui";

export function WritingPage({ lang }: { lang: Locale }) {
    const copy = portfolioCopy[lang];
    const pageCopy = copy.pages.writing;
    const posts = getPosts(lang);
    const path = portfolioPath(lang, "writing");
    const blogJsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${absoluteUrl(path)}#blog`,
        url: absoluteUrl(path),
        name: pageCopy.title,
        description: pageCopy.description,
        inLanguage: lang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map((post) => ({
            "@type": "BlogPosting",
            headline: post.info.title,
            description: post.info.description,
            url: absoluteUrl(postPath(lang, post.href)),
            datePublished: post.date,
            inLanguage: lang,
            keywords: post.info.subjects.join(", "),
            author: { "@id": `${SITE_URL}/#person` },
        })),
    };
    return (
        <PortfolioPage>
            <JsonLd data={blogJsonLd} />
            <header className="max-w-3xl">
                <p className="mb-4 font-display text-sm font-medium uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                    {pageCopy.eyebrow}
                </p>
                <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-6xl">{pageCopy.title}</h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">{pageCopy.description}</p>
            </header>
            <section className="mt-16" aria-labelledby="writing-archive-title">
                <h2
                    id="writing-archive-title"
                    className="mb-8 font-display text-2xl tracking-tight text-foreground sm:text-3xl"
                >
                    {copy.writing.recent}
                </h2>
                <WritingGrid posts={posts} lang={lang} />
            </section>
        </PortfolioPage>
    );
}
