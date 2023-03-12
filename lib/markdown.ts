import fs from "fs";
import gfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

export const toMarkdown = async (markdown: string) =>
  serialize(markdown, {
    parseFrontmatter: false,
    mdxOptions: {
      format: "mdx",
      remarkPlugins: [gfm],
    },
  });

export const getAllSlugs = (dir: string) => () =>
  fs.readdirSync(dir).filter((x) => x.endsWith(".md"));


export const getAllMdFiles = <
  T extends { date: string; slug: string; content: string }
>(
  fields: Array<keyof T>,
  get: () => string[],
  getBySlug: (slug: string, fields: Array<keyof T>) => T
): T[] =>
  get()
    .map((slug): T => getBySlug(slug, fields) as any)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
