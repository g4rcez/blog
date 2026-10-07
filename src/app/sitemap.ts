import { getPosts } from "@/components/server/posts";
import { getTopics } from "@/components/server/topics";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/dictionary";
import {
    absoluteUrl,
    languageAlternates,
    localizedAlternates,
    localeToPath,
    postPath,
    tagsBasePath,
} from "@/lib/seo";
import type { MetadataRoute } from "next";

const buildAlternates = (translations: string[], href: string) => ({
    languages: languageAlternates(translations, href),
});

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const homeAlternates = localizedAlternates(SUPPORTED_LOCALES, (locale) => localeToPath[locale]);
    const homeEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
        url: absoluteUrl(localeToPath[locale]),
        lastModified: now,
        changeFrequency: "weekly",
        priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
        alternates: { languages: homeAlternates },
    }));

    const tagIndexAlternates = localizedAlternates(SUPPORTED_LOCALES, (locale) => tagsBasePath[locale]);
    const tagIndexEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((locale) => ({
        url: absoluteUrl(tagsBasePath[locale]),
        lastModified: now,
        changeFrequency: "weekly",
        priority: locale === DEFAULT_LOCALE ? 0.7 : 0.6,
        alternates: { languages: tagIndexAlternates },
    }));

    const postEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
        getPosts(locale).map((post) => ({
            url: absoluteUrl(postPath(locale, post.href)),
            lastModified: new Date(post.date),
            changeFrequency: "monthly",
            priority: locale === DEFAULT_LOCALE ? 0.8 : 0.7,
            alternates: buildAlternates(post.info.translations, post.href),
        })),
    );

    const topicsByLocale = new Map(SUPPORTED_LOCALES.map((locale) => [locale, getTopics(locale)] as const));
    const topicEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
        (topicsByLocale.get(locale) ?? []).map((topic) => {
            const alternateLocales = SUPPORTED_LOCALES.filter((supportedLocale) =>
                topicsByLocale.get(supportedLocale)?.some((candidate) => candidate.slug === topic.slug),
            );
            const href = `${tagsBasePath[locale]}/${topic.slug}`;
            return {
                url: absoluteUrl(href),
                lastModified: new Date(topic.latest),
                changeFrequency: "weekly",
                priority: locale === DEFAULT_LOCALE ? 0.7 : 0.6,
                alternates: {
                    languages: localizedAlternates(
                        alternateLocales,
                        (alternateLocale) => `${tagsBasePath[alternateLocale]}/${topic.slug}`,
                    ),
                },
            };
        }),
    );

    return [...homeEntries, ...tagIndexEntries, ...topicEntries, ...postEntries];
}
