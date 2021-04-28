import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import remark from "remark";
import html from "remark-html";
import prism from "remark-prism";
import gfm from "remark-gfm";

export type PostFile = {
  title: string;
  description?: string;
  date: string;
  image: string;
};

const postsDirectory = join(process.cwd(), "_posts");

export const getPostSlugs = () => fs.readdirSync(postsDirectory);

export type Post = PostFile & {
  slug: string;
  content: string;
  readingTime: number;
  subjects: string[];
};
export type Keys = keyof Post;

export function getPostBySlug(slug: string, fields: Keys[] = []): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const readingTime = Math.ceil(content.split(" ").length / 250);

  const items = { readingTime };

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }
    if (data[field]) {
      items[field] = data[field] ?? "";
    }
  });
  return items as never;
}

export const getAllPosts = (fields: Keys[] = []) =>
  getPostSlugs()
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

export const toMarkdown = async (markdown: string) => {
  const result = await remark()
    .use(html)
    .use(gfm)
    .use(prism, {
      /* transformInlineCode: true, */
      plugins: [
        "line-numbers",
        "autolinker",
        "command-line",
        "data-uri-highlight",
        "diff-highlight",
        "inline-color",
        "keep-markup",
        "treeview",
      ],
    })
    .process(markdown);
  return result.toString();
};
