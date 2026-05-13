import { getTopicPosts, getTopics } from "@/components/server/topics";
import { TopicPage } from "@/components/server/topic-page";
import { absoluteUrl, DEFAULT_OG_IMAGE, topicCopy, topicsBasePath } from "@/lib/seo";
import { BlogConfig } from "@/blog.config";
import type { Metadata } from "next";

const lang = "en-US" as const;

export const dynamicParams = false;

export async function generateStaticParams() {
    return getTopics(lang).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { topic } = getTopicPosts(lang, slug);
    if (!topic) return { robots: { index: false, follow: false } };
    const canonical = `${topicsBasePath[lang]}/${slug}`;
    const ptHas = getTopics("pt-BR").find((t) => t.slug === slug);
    const languages: Record<string, string> = {
        "en-US": absoluteUrl(canonical),
        "x-default": absoluteUrl(canonical),
    };
    if (ptHas) languages["pt-BR"] = absoluteUrl(`${topicsBasePath["pt-BR"]}/${slug}`);
    const copy = topicCopy[lang];
    return {
        title: copy.title(topic.name),
        description: copy.description(topic.name),
        keywords: [topic.name, ...BlogConfig.topics.map((t) => t.title[lang])],
        alternates: { canonical, languages },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
        openGraph: {
            type: "website",
            url: absoluteUrl(canonical),
            siteName: BlogConfig.name[lang],
            title: copy.title(topic.name),
            description: copy.description(topic.name),
            locale: "en_US",
            images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: topic.name }],
        },
        twitter: {
            card: "summary_large_image",
            site: "@garcez_allan",
            creator: "@garcez_allan",
            title: copy.title(topic.name),
            description: copy.description(topic.name),
            images: [DEFAULT_OG_IMAGE],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <TopicPage lang={lang} slug={slug} />;
}
