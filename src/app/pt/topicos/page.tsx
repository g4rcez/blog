import { TopicsIndex } from "@/components/server/topics-index";
import { absoluteUrl, DEFAULT_OG_IMAGE, topicCopy, topicsBasePath } from "@/lib/seo";
import { BlogConfig } from "@/blog.config";
import type { Metadata } from "next";

const lang = "pt-BR" as const;

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: topicCopy[lang].index.title,
    description: topicCopy[lang].index.description,
    alternates: {
        canonical: topicsBasePath[lang],
        languages: {
            "en-US": absoluteUrl(topicsBasePath["en-US"]),
            "pt-BR": absoluteUrl(topicsBasePath["pt-BR"]),
            "x-default": absoluteUrl(topicsBasePath["en-US"]),
        },
    },
    openGraph: {
        type: "website",
        url: absoluteUrl(topicsBasePath[lang]),
        siteName: BlogConfig.name[lang],
        title: topicCopy[lang].index.title,
        description: topicCopy[lang].index.description,
        locale: "pt_BR",
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Tópicos" }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@garcez_allan",
        creator: "@garcez_allan",
        title: topicCopy[lang].index.title,
        description: topicCopy[lang].index.description,
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function Page() {
    return <TopicsIndex lang={lang} />;
}
