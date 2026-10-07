import { BlogConfig } from "@/blog.config";
import { SUPPORTED_LOCALES, type Locale } from "./dictionary";
import { absoluteUrl, DEFAULT_OG_IMAGE, localizedAlternates, ogLocale, SITE_URL } from "./seo";
import { portfolioPath, type PortfolioSection } from "./portfolio";
import type { Metadata } from "next";

type PortfolioMetadataOptions = {
    lang: Locale;
    section: PortfolioSection;
    title: string;
    description: string;
    keywords: string[];
    slug?: string;
    type?: "website" | "article";
};

export function portfolioMetadata({
    lang,
    section,
    title,
    description,
    keywords,
    slug,
    type = "website",
}: PortfolioMetadataOptions): Metadata {
    const canonicalPath = portfolioPath(lang, section, slug);
    const fullUrl = absoluteUrl(canonicalPath);
    return {
        title,
        description,
        keywords,
        authors: [{ name: BlogConfig.user.name, url: SITE_URL }],
        creator: BlogConfig.user.name,
        publisher: BlogConfig.user.name,
        alternates: {
            canonical: canonicalPath,
            languages: localizedAlternates(SUPPORTED_LOCALES, (locale) => portfolioPath(locale, section, slug)),
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
        openGraph: {
            type,
            url: fullUrl,
            siteName: BlogConfig.name[lang],
            title,
            description,
            locale: ogLocale[lang],
            alternateLocale: SUPPORTED_LOCALES.filter((locale) => locale !== lang).map((locale) => ogLocale[locale]),
            images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            site: "@garcez_allan",
            creator: "@garcez_allan",
            title,
            description,
            images: [DEFAULT_OG_IMAGE],
        },
    };
}
