import { BlogConfig } from "@/blog.config";
import { Locale } from "@/lib/dictionary";

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
            "Frontend engineering, TypeScript, React, Node.js, and developer tooling. Deep dives, patterns, and lessons from 25+ years building products.",
    },
    "pt-BR": {
        title: `${BlogConfig.user.name} — Blog de Engenharia Frontend`,
        description:
            "Engenharia frontend, TypeScript, React, Node.js e ferramentas para desenvolvedores. Análises, padrões e aprendizados de 25+ anos construindo produtos.",
    },
};

export const topicsBasePath: Record<Locale, string> = {
    "en-US": "/topics",
    "pt-BR": "/pt/topicos",
};

export const topicCopy: Record<
    Locale,
    {
        title: (topic: string) => string;
        description: (topic: string) => string;
        index: { title: string; description: string };
    }
> = {
    "en-US": {
        title: (topic) => `${topic} — Articles by Allan Garcez`,
        description: (topic) =>
            `Posts, deep dives and patterns about ${topic} from a senior frontend engineer with 25+ years building products.`,
        index: {
            title: "Topics — Allan Garcez Blog",
            description:
                "Browse every topic covered on the blog: frontend, TypeScript, React, Node.js, tooling and more.",
        },
    },
    "pt-BR": {
        title: (topic) => `${topic} — Artigos por Allan Garcez`,
        description: (topic) =>
            `Posts, análises e padrões sobre ${topic} por um engenheiro frontend sênior com 25+ anos construindo produtos.`,
        index: {
            title: "Tópicos — Blog do Allan Garcez",
            description:
                "Explore todos os tópicos cobertos no blog: frontend, TypeScript, React, Node.js, ferramentas e mais.",
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

export const postPath = (lang: Locale, href: string): string => {
    if (lang === "pt-BR") return `/pt${href}`;
    return href;
};

export const languageAlternates = (translations: string[], href: string) => {
    const map: Record<string, string> = {};
    translations.forEach((t) => {
        const lower = t.toLowerCase();
        if (lower === "en-us") map["en-US"] = absoluteUrl(href);
        if (lower === "pt-br") map["pt-BR"] = absoluteUrl(`/pt${href}`);
    });
    if (map["en-US"]) map["x-default"] = map["en-US"];
    return map;
};
