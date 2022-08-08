import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import gfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { Fragment, createElement } from "react";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react/lib";
import { MdxComponents } from "../components/mdx";

export const rehype = async (text: string) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      Fragment: Fragment,
      components: MdxComponents,
      createElement: createElement,
    } as any)
    .process(text);

export const toMarkdown = async (markdown: string): Promise<string> => {
  try {
    const parsed = await unified()
      .use(gfm as any)
      .use(remarkBreaks)
      .use(remarkRehype)
      .use(remarkParse)
      .use(rehypeStringify)
      // .use(rehypeHighlight as any)
      .process(markdown);
    return parsed.toString();
  } catch (error) {
    console.log("ERROR", error);
    return "";
  }
};

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

  const items: Partial<Post> = { readingTime };

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
