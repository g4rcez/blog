import { BlogConfig } from "@/blog.config";
import { getPosts, type SimplePost } from "@/components/server/posts";
import { getTopicPosts, getTopics } from "@/components/server/topics";
import type { Locale } from "@/lib/dictionary";
import { absoluteUrl, homeCopy, SITE_URL, topicCopy, topicsBasePath } from "@/lib/seo";
import fs from "node:fs";
import path from "node:path";

const appDir = path.join(process.cwd(), "src", "app");

const markdownCacheControl = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

const labels = {
    "en-US": {
        recentPosts: "Recent posts",
        topics: "Topics",
        articles: (count: number) => `${count} ${count === 1 ? "article" : "articles"}`,
    },
    "pt-BR": {
        recentPosts: "Posts recentes",
        topics: "Tópicos",
        articles: (count: number) => `${count} ${count === 1 ? "artigo" : "artigos"}`,
    },
} satisfies Record<Locale, { recentPosts: string; topics: string; articles: (count: number) => string }>;

const projectMarkdown = `# the-mask-input

A 3.9kB input masking library for React. Drop-in \`<Input />\` with built-in masks for CPF, CNPJ, phone, date, currency, and more.

- [GitHub](https://github.com/g4rcez/the-mask-input)
- [npm](https://www.npmjs.com/package/the-mask-input)

## Installation

\`\`\`bash
pnpm add the-mask-input
\`\`\`

\`\`\`tsx
import { Input } from "@g4rcez/components/input";

export default function App() {
  return (
    <form>
      <Input name="cpf" mask="cpf" title="CPF" placeholder="000.000.000-00" />
    </form>
  );
}
\`\`\`

\`@g4rcez/components\` wraps \`the-mask-input\` — all named masks and custom mask features are available through it.

## Built-in masks

- \`cpf\` — 000.000.000-00
- \`cnpj\` — 00.000.000/0000-00
- \`cpfCnpj\` — CPF or CNPJ (auto-detects by length)
- \`cep\` — 000000-000
- \`cellphone\` — (00) 90000-0000
- \`telephone\` — (00) 0000-0000
- \`cellTelephone\` — cellphone or telephone (auto-detects)
- \`int\` — integers only
- \`color\` — #000 or #000000
- \`creditCard\` — 0000 0000 0000 0000
- \`date\` — dd/MM/yyyy
- \`isoDate\` — yyyy/MM/dd
- \`time\` — 00:00
- \`uuid\` — UUID format

## Custom masks

### Token-based

Pass a string where each character is a token. Useful for fixed-length formats that match a single character class per position.

\`\`\`tsx
// Tokens: d = digit, H = hex, X = alphanumeric, x = alpha, A = uppercase, a = lowercase
import { Input } from "@g4rcez/components/input";

<Input name="doc" mask="ddd.ddd.ddd-dd" title="Custom document" placeholder="000.000.000-00" />
\`\`\`

### Regex array

Pass an array where each element is either a literal string (fixed character) or a \`RegExp\` (validated position). Useful for formats with mixed literals and character classes.

\`\`\`tsx
// Brazilian license plate: ABC-1234
import { Input } from "@g4rcez/components/input";

<Input
  name="plate"
  title="License plate"
  mask={[/[A-Z]/, /[A-Z]/, /[A-Z]/, "-", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="ABC-1234"
/>
\`\`\`

### Function-based

Pass a function that receives the current value and returns a mask. Useful when the mask pattern depends on what the user has typed so far.

\`\`\`tsx
// Validates hours 00–23 by switching the pattern when the first digit is "2"
import { Input } from "@g4rcez/components/input";

const hourMask = (value: string) => {
  const startsWithTwo = ["2", /[0-3]/, ":", /[0-5]/, /\\d/];
  const defaultHour  = [/[01]/, /\\d/, ":", /[0-5]/, /\\d/];
  return value.startsWith("2") ? startsWithTwo : defaultHour;
};

<Input name="hour" title="Hour" mask={hourMask} placeholder="00:00" />
\`\`\`
`;

const normalizeRoutePath = (routePath: string) => {
    const withoutQuery = routePath.split("?")[0] || "/";
    const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
    const withoutTrailingSlash = withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;

    if (withoutTrailingSlash === "/index") return "/";

    return withoutTrailingSlash;
};

const stripFrontmatter = (content: string) => content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();

const markdownFileForRoute = (routePath: string) => {
    const segments = routePath === "/" ? [] : routePath.split("/").filter(Boolean);
    return path.join(appDir, ...segments, "page.md");
};

const formatPostLink = (post: SimplePost) =>
    `- [${post.info.title}](${absoluteUrl(post.href)}) — ${post.info.description}`;

export const createMarkdownResponse = (body: string, init?: ResponseInit) =>
    new Response(`${body.trim()}\n`, {
        ...init,
        headers: {
            "content-type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(Math.ceil(body.split(/\s+/).filter(Boolean).length * 1.35)),
            "cache-control": markdownCacheControl,
            ...init?.headers,
        },
    });

export const getHomeMarkdown = (lang: Locale) => {
    const posts = getPosts(lang);
    const copy = homeCopy[lang];
    const l = labels[lang];

    return [
        `# ${copy.title}`,
        "",
        copy.description,
        "",
        `## ${l.recentPosts}`,
        "",
        ...posts.slice(0, 20).map(formatPostLink),
    ].join("\n");
};

const getTopicsIndexMarkdown = (lang: Locale) => {
    const topics = getTopics(lang);
    const copy = topicCopy[lang].index;
    const l = labels[lang];

    return [
        `# ${l.topics}`,
        "",
        copy.description,
        "",
        ...topics.map(
            (topic) =>
                `- [${topic.name}](${absoluteUrl(`${topicsBasePath[lang]}/${topic.slug}`)}) — ${l.articles(topic.count)}`,
        ),
    ].join("\n");
};

const getTopicMarkdown = (lang: Locale, slug: string) => {
    const { topic, posts } = getTopicPosts(lang, slug);
    if (!topic) return null;

    const l = labels[lang];

    return [`# ${topic.name}`, "", l.articles(posts.length), "", ...posts.map(formatPostLink)].join("\n");
};

export const getMarkdownForRoute = (rawRoutePath: string): string | null => {
    const routePath = normalizeRoutePath(rawRoutePath);

    if (routePath === "/" || routePath === "/markdown") return getHomeMarkdown(BlogConfig.defaultLanguage as Locale);
    if (routePath === "/pt" || routePath === "/pt/markdown") return getHomeMarkdown("pt-BR");
    if (routePath === "/topics") return getTopicsIndexMarkdown("en-US");
    if (routePath === "/pt/topicos") return getTopicsIndexMarkdown("pt-BR");
    if (routePath === "/projects/the-mask-input") return projectMarkdown;

    const topicMatch = routePath.match(/^\/topics\/([^/]+)$/);
    if (topicMatch) return getTopicMarkdown("en-US", topicMatch[1]);

    const ptTopicMatch = routePath.match(/^\/pt\/topicos\/([^/]+)$/);
    if (ptTopicMatch) return getTopicMarkdown("pt-BR", ptTopicMatch[1]);

    const file = markdownFileForRoute(routePath);
    if (!fs.existsSync(file)) return null;

    return stripFrontmatter(fs.readFileSync(file, "utf-8"));
};

export const createMarkdownRouteResponse = (routePath: string) => {
    const body = getMarkdownForRoute(routePath);

    if (!body)
        return createMarkdownResponse("# Not found\n\nNo markdown representation exists for this route.", {
            status: 404,
        });

    return createMarkdownResponse(body);
};
