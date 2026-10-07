import { BlogConfig } from "@/blog.config";
import { DEFAULT_LOCALE, findSupportedLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/dictionary";

export const SITE_URL = BlogConfig.site;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;

export const localeToPath: Record<Locale, string> = {
    "en-US": "/",
    "pt-BR": "/pt",
};

export const ogLocale: Record<Locale, string> = {
    "en-US": "en_US",
    "pt-BR": "pt_BR",
};

export const homeCopy: Record<Locale, { title: string; description: string }> = {
    "en-US": {
        title: `${BlogConfig.user.name} — Senior Frontend Engineer Blog`,
        description:
            "Writing about frontend engineering, TypeScript, React, Node.js, and developer tooling after 10+ years of building products.",
    },
    "pt-BR": {
        title: `${BlogConfig.user.name} — Blog de Engenharia Frontend`,
        description:
            "Textos sobre engenharia frontend, TypeScript, React, Node.js e ferramentas para desenvolvedores, a partir de 10+ anos construindo produtos."
    },
};

export const tagsBasePath: Record<Locale, string> = {
    "en-US": "/tags",
    "pt-BR": "/pt/tags",
};

export const tagCopy: Record<
    Locale,
    {
        title: (tag: string) => string;
        description: (tag: string) => string;
        index: { title: string; description: string };
    }
> = {
    "en-US": {
        title: (tag) => `${tag} — Articles by Allan Garcez`,
        description: (tag) =>
            `Articles and practical notes about ${tag} from a senior frontend engineer with 10+ years of product experience.`,
        index: {
            title: "Tags — Allan Garcez Blog",
            description:
                "Browse the tags used on the blog, from frontend and TypeScript to React, Node.js, and tooling.",
        },
    },
    "pt-BR": {
        title: (tag) => `${tag} — Artigos por Allan Garcez`,
        description: (tag) =>
            `Artigos, análises e padrões sobre ${tag}, escritos por um engenheiro frontend sênior com 10+ anos de experiência em produtos.`,
        index: {
            title: "Tags — Blog do Allan Garcez",
            description:
                "Explore as tags do blog, de frontend e TypeScript a React, Node.js e ferramentas para desenvolvedores.",
        },
    },
};

export const slugifyTopic = (s: string): string =>
    s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export const homeKeywords: Record<Locale, string[]> = {
    "en-US": [
        "frontend",
        "javascript",
        "typescript",
        "react",
        "nodejs",
        "web performance",
        "design system",
        "developer experience",
        "Allan Garcez",
    ],
    "pt-BR": [
        "frontend",
        "javascript",
        "typescript",
        "react",
        "nodejs",
        "performance web",
        "design system",
        "experiência do desenvolvedor",
        "Allan Garcez",
    ],
};

export const absoluteUrl = (path: string): string => {
    if (path.startsWith("http")) return path;
    if (path === "" || path === "/") return SITE_URL;
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const localizedPath = (locale: Locale, href = ""): string => {
    const existingPrefix = Object.values(localeToPath)
        .filter((prefix) => prefix !== "/")
        .sort((left, right) => right.length - left.length)
        .find((prefix) => href === prefix || href.startsWith(`${prefix}/`));
    let suffix = existingPrefix ? href.slice(existingPrefix.length) : href;
    const prefix = localeToPath[locale];

    if (suffix === "/") suffix = "";
    if (suffix && !suffix.startsWith("/")) suffix = `/${suffix}`;
    return `${prefix === "/" ? "" : prefix}${suffix}` || "/";
};

export const removeLocalePath = (locale: Locale, pathname: string): string => {
    const prefix = localeToPath[locale];
    if (prefix === "/") return pathname;
    if (pathname === prefix) return "/";
    return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
};

export const localeFromPath = (pathname: string | null): Locale => {
    if (!pathname) return DEFAULT_LOCALE;

    const locale = [...SUPPORTED_LOCALES]
        .filter((supportedLocale) => localeToPath[supportedLocale] !== "/")
        .sort((left, right) => localeToPath[right].length - localeToPath[left].length)
        .find((supportedLocale) => {
            const prefix = localeToPath[supportedLocale];
            return pathname === prefix || pathname.startsWith(`${prefix}/`);
        });

    return locale ?? DEFAULT_LOCALE;
};

export const localizedAlternates = (
    locales: readonly Locale[],
    hrefForLocale: (locale: Locale) => string,
): Record<string, string> => {
    const languages: Record<string, string> = {};
    for (const locale of locales) languages[locale] = absoluteUrl(hrefForLocale(locale));

    const defaultUrl = languages[DEFAULT_LOCALE] ?? Object.values(languages)[0];
    if (defaultUrl) languages["x-default"] = defaultUrl;
    return languages;
};

export const postPath = (lang: Locale, href: string): string => localizedPath(lang, href);

export const languageAlternates = (translations: string[], href: string) => {
    const locales = SUPPORTED_LOCALES.filter((locale) =>
        translations.some((translation) => findSupportedLocale(translation) === locale),
    );
    return localizedAlternates(locales, (locale) => postPath(locale, href));
};
