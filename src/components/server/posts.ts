import { BlogConfig } from "@/blog.config";
import { PostSchema, readingTime } from "@/lib/models";
import Markdoc from "@markdoc/markdoc";
import glob from "fast-glob";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";

const base = path.resolve(path.join(process.cwd(), "src", "app"));

const transformLangToPath = (defaultLang: string, lang: string) => {
  if (lang.toLowerCase() === defaultLang.toLowerCase()) return "";
  return lang.split("-")[0];
};

export const getPosts = (language: string) => {
  const lang = language.toLowerCase();
  const dir = path.join(base, transformLangToPath(BlogConfig.defaultLanguage, lang), "posts", "**", "page.md");
  const posts = glob
    .sync(dir)
    .map((file) => {
      const href = file.replace(/\/page\.mdx?$/, "").replace(base, "");
      const fullPath = path.resolve(file);
      const content = fs.readFileSync(fullPath, "utf-8");
      const doc = Markdoc.parse(content);
      const info = PostSchema.parse(yaml.load(doc.attributes.frontmatter));
      const date = info.date;
      return { href, info, date, readingTime: readingTime(content), translations: info.translations };
    })
    .toSorted((a, b) => (a.date < b.date ? 1 : -1));
  return posts.filter((x) => x.translations.includes(lang));
};

export type SimplePost = ReturnType<typeof getPosts>[number];
