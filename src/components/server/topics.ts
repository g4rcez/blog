import { getPosts, SimplePost } from "@/components/server/posts";
import { Locale } from "@/lib/dictionary";
import { slugifyTopic } from "@/lib/seo";

export type TopicSummary = { slug: string; name: string; count: number; latest: string };

export const getTopics = (lang: Locale): TopicSummary[] => {
    const posts = getPosts(lang);
    const map = new Map<string, { name: string; count: number; latest: string }>();
    posts.forEach((p) => {
        p.info.subjects.forEach((subject) => {
            const slug = slugifyTopic(subject);
            if (!slug) return;
            const prev = map.get(slug);
            if (!prev) return map.set(slug, { name: subject, count: 1, latest: p.date });
            prev.count += 1;
            if (p.date > prev.latest) prev.latest = p.date;
        });
    });
    return Array.from(map.entries())
        .map(([slug, v]) => ({ slug, ...v }))
        .sort((a, b) => b.count - a.count);
};

export const getTopicPosts = (lang: Locale, slug: string): { topic: TopicSummary | null; posts: SimplePost[] } => {
    const topics = getTopics(lang);
    const topic = topics.find((t) => t.slug === slug) || null;
    if (!topic) return { topic: null, posts: [] };
    const posts = getPosts(lang).filter((p) => p.info.subjects.some((s) => slugifyTopic(s) === slug));
    return { topic, posts };
};
