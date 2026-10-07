import { getPosts, SimplePost } from "@/components/server/posts";
import { Locale, SUPPORTED_LOCALES } from "@/lib/dictionary";
import { localizedAlternates, slugifyTopic, tagsBasePath } from "@/lib/seo";

export type TopicSummary = { slug: string; name: string; count: number; latest: string };

export const getTopics = (lang: Locale): TopicSummary[] => {
    const posts = getPosts(lang);
    const map = new Map<string, { name: string; count: number; latest: string }>();
    for (const post of posts) {
        for (const subject of post.info.subjects) {
            const slug = slugifyTopic(subject);
            if (!slug) continue;
            const previous = map.get(slug);
            if (!previous) {
                map.set(slug, { name: subject, count: 1, latest: post.date });
                continue;
            }
            previous.count += 1;
            if (post.date > previous.latest) previous.latest = post.date;
        }
    }
    return Array.from(map.entries())
        .map(([slug, v]) => ({ slug, ...v }))
        .sort((a, b) => b.count - a.count);
};

export const getTopicAlternates = (slug: string) => {
    const locales = SUPPORTED_LOCALES.filter((locale) => getTopics(locale).some((topic) => topic.slug === slug));
    return localizedAlternates(locales, (locale) => `${tagsBasePath[locale]}/${slug}`);
};

export const getTopicPosts = (lang: Locale, slug: string): { topic: TopicSummary | null; posts: SimplePost[] } => {
    const topics = getTopics(lang);
    const topic = topics.find((t) => t.slug === slug) || null;
    if (!topic) return { topic: null, posts: [] };
    const posts = getPosts(lang).filter((p) => p.info.subjects.some((s) => slugifyTopic(s) === slug));
    return { topic, posts };
};
