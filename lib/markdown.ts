import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
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

type MarkdownFile = {
  slug: string;
  content: string;
};

export function getFileByName<T extends MarkdownFile>(basedir: string) {
  return (
    slug: string,
    fields: Array<keyof T> = []
  ): T & { readingTime: number } => {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(basedir, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const readingTime = Math.ceil(content.split(" ").length / 250);

    const items: any = { readingTime };

    fields.forEach((field) => {
      if (field === "slug") {
        items[field] = realSlug;
      }
      if (field === "content") {
        items[field] = content;
      }
      const d = (data as any)[field];
      if (d) {
        if (d instanceof Date) items[field] = d.toISOString();
        else items[field] = d ?? "";
      }
    });
    return items as never;
  };
}

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
