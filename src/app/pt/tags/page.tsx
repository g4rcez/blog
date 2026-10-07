import { TopicsIndex } from "@/components/server/topics-index";
import { absoluteUrl, DEFAULT_OG_IMAGE, localizedAlternates, ogLocale, tagCopy, tagsBasePath } from "@/lib/seo";
import { SUPPORTED_LOCALES } from "@/lib/dictionary";
import { BlogConfig } from "@/blog.config";
import type { Metadata } from "next";

const lang = "pt-BR" as const;

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: tagCopy[lang].index.title,
    description: tagCopy[lang].index.description,
    alternates: {
        canonical: tagsBasePath[lang],
        languages: localizedAlternates(SUPPORTED_LOCALES, (locale) => tagsBasePath[locale]),
    },
    openGraph: {
        type: "website",
        url: absoluteUrl(tagsBasePath[lang]),
        siteName: BlogConfig.name[lang],
        title: tagCopy[lang].index.title,
        description: tagCopy[lang].index.description,
        locale: ogLocale[lang],
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Tags" }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@garcez_allan",
        creator: "@garcez_allan",
        title: tagCopy[lang].index.title,
        description: tagCopy[lang].index.description,
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function Page() {
    return <TopicsIndex lang={lang} />;
}
