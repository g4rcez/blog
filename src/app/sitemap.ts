import { BlogConfig } from "@/blog.config";
import { getPosts } from "@/components/server/posts";
import { getTopics } from "@/components/server/topics";
import { absoluteUrl, SITE_URL, topicsBasePath } from "@/lib/seo";
import type { MetadataRoute } from "next";

const buildAlternates = (translations: string[], href: string) => {
    const languages: Record<string, string> = {};
    translations.forEach((t) => {
        const lower = t.toLowerCase();
        if (lower === "en-us") languages["en-US"] = absoluteUrl(href);
        if (lower === "pt-br") languages["pt-BR"] = absoluteUrl(`/pt${href}`);
    });
    if (languages["en-US"]) languages["x-default"] = languages["en-US"];
    return { languages };
};

export default function sitemap(): MetadataRoute.Sitemap {
    const en = getPosts(BlogConfig.defaultLanguage);
    const pt = getPosts("pt-BR");
    const now = new Date();

    const home: MetadataRoute.Sitemap[number] = {
        url: SITE_URL,
        lastModified: now,
        changeFrequency: "daily",
        priority: 1,
        alternates: { languages: { "en-US": SITE_URL, "pt-BR": `${SITE_URL}/pt`, "x-default": SITE_URL } },
    };

    const homePt: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/pt`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: { languages: { "en-US": SITE_URL, "pt-BR": `${SITE_URL}/pt`, "x-default": SITE_URL } },
    };

    const enEntries: MetadataRoute.Sitemap = en.map((p) => ({
        url: absoluteUrl(p.href),
        lastModified: new Date(p.date),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: buildAlternates(p.info.translations, p.href),
    }));

    const ptEntries: MetadataRoute.Sitemap = pt.map((p) => ({
        url: absoluteUrl(`/pt${p.href}`),
        lastModified: new Date(p.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: buildAlternates(p.info.translations, p.href),
    }));

    const enTopics = getTopics("en-US");
    const ptTopics = getTopics("pt-BR");
    const enTopicsIndex: MetadataRoute.Sitemap[number] = {
        url: absoluteUrl(topicsBasePath["en-US"]),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
    };
    const ptTopicsIndex: MetadataRoute.Sitemap[number] = {
        url: absoluteUrl(topicsBasePath["pt-BR"]),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
    };
    const enTopicEntries: MetadataRoute.Sitemap = enTopics.map((t) => ({
        url: absoluteUrl(`${topicsBasePath["en-US"]}/${t.slug}`),
        lastModified: new Date(t.latest),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: ptTopics.find((p) => p.slug === t.slug)
            ? {
                  languages: {
                      "en-US": absoluteUrl(`${topicsBasePath["en-US"]}/${t.slug}`),
                      "pt-BR": absoluteUrl(`${topicsBasePath["pt-BR"]}/${t.slug}`),
                      "x-default": absoluteUrl(`${topicsBasePath["en-US"]}/${t.slug}`),
                  },
              }
            : undefined,
    }));
    const ptTopicEntries: MetadataRoute.Sitemap = ptTopics.map((t) => ({
        url: absoluteUrl(`${topicsBasePath["pt-BR"]}/${t.slug}`),
        lastModified: new Date(t.latest),
        changeFrequency: "weekly",
        priority: 0.6,
    }));
    return [
        home,
        homePt,
        enTopicsIndex,
        ptTopicsIndex,
        ...enTopicEntries,
        ...ptTopicEntries,
        ...enEntries,
        ...ptEntries,
    ];
}
