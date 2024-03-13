import path from "node:path";
import fs from "node:fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import gfm from "remark-gfm";
import frontmatter from "front-matter";
import { PostMetadata } from "~/markdown/types";

export namespace MarkdownServer {
    const root = path.resolve(process.cwd(), "public", "posts");

    export const getFile = async (name: string): Promise<string | null> => {
        try {
            const file = path.join(root, `${name}.md`);
            const content = await fs.readFile(file, "utf-8");
            return content;
        } catch (e) {
            return null;
        }
    };

    export const serializeMarkdown = async (content: string) => {
        const markdown = await serialize(content, {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [gfm],
            },
        });
        return markdown;
    };

    export const paginate = <T extends any>(list: T[], page: number, pageSize: number) => {
        const maxPageSize = Math.min(50, pageSize);
        return list.slice(page * maxPageSize, Math.max(page, 1) * (maxPageSize * 2));
    };

    export const sort = (posts: PostMetadata[]) => posts.toSorted((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA > dateB ? -1 : 1;
    });

    export const getAll = async (page: number = 0, pageSize: number = 1): Promise<PostMetadata[]> => {
        try {
            const posts = await fs.readdir(root, "utf-8");
            const contentFiles = await Promise.all(posts.map(async (post): Promise<PostMetadata> => {
                const filename = post.replace(/\.md$/, "");
                const content = await getFile(filename);
                const attributes = frontmatter(content!).attributes as PostMetadata;
                return { ...attributes, href: filename };
            }));
            const sorted = sort(contentFiles);
            return paginate(sorted, page, pageSize);
        } catch (e) {
            return [];
        }
    };
}