import { BlogConfig } from "@/blog.config";
import { agentSkills } from "@/lib/agent-skills";
import { getMarkdownForRoute } from "@/lib/markdown-routes";
import { tagsBasePath } from "@/lib/seo";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { getTopics } from "@/components/server/topics";
import { projects } from "@/lib/portfolio";
import type { SimplePost } from "./posts";

const absoluteUrl = (href: string) => new URL(href, BlogConfig.site).href;

const asTypeScriptArray = (name: string, values: unknown[]) =>
    `export const ${name} = ${JSON.stringify(values, null, 2)} as const;\n`;

export function getTerminalFiles(locale: Locale, posts: SimplePost[]) {
    const copy = getTranslation(locale).terminal;
    const entries: Array<[string, string]> = [
        ["/home/user/README.md", copy.readme],
        [
            "/home/user/agents.ts",
            asTypeScriptArray(
                "agents",
                BlogConfig.agents.map((agent) => ({
                    name: agent.title[locale],
                    url: absoluteUrl(agent.href),
                })),
            ),
        ],
        [
            "/home/user/skills.ts",
            asTypeScriptArray(
                "skills",
                agentSkills.map((skill) => ({
                    name: skill.name,
                    type: skill.type,
                    description: skill.description,
                    url: absoluteUrl(skill.href),
                })),
            ),
        ],
    ];

    for (const post of posts) {
        const markdown = getMarkdownForRoute(post.href);
        const slug = post.href.slice(post.href.lastIndexOf("/") + 1);
        if (markdown !== null && slug) {
            entries.push([`/home/user/posts/${slug}.md`, markdown]);
        }
    }

    for (const tag of getTopics(locale)) {
        const markdown = getMarkdownForRoute(`${tagsBasePath[locale]}/${tag.slug}`);
        if (markdown !== null) entries.push([`/home/user/tags/${tag.slug}.md`, markdown]);
    }

    for (const project of projects) {
        entries.push([
            `/home/user/projects/${project.slug}.md`,
            [
                `# ${project.name}`,
                "",
                project.description[locale],
                "",
                `## ${copy.technologies}`,
                "",
                project.technologies.join(", "),
                "",
                `## ${copy.links}`,
                "",
                ...project.links.map((link) => `- [${link.label}](${absoluteUrl(link.href)})`),
                "",
            ].join("\n"),
        ]);
    }

    return Object.fromEntries(entries);
}
