import { QuickLink, QuickLinks } from "@/components/quick-links";
import { filterPosts, PostSchema, readingTime } from "@/lib/models";
import Markdoc from "@markdoc/markdoc";
import glob from "fast-glob";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

const base = path.resolve(path.join(process.cwd(), "src", "app"));

const POSTS_PATH = "./src/posts.json";

const getPosts = () => {
    if (process.env.NODE_ENV === "production") {
        return JSON.parse(fs.readFileSync(POSTS_PATH, "utf-8"));
    }
    return glob
        .sync(path.join(base, "posts", "**", "page.md"))
        .map((file) => {
            const href = file.replace(/\/page\.mdx?$/, "").replace(base, "");
            const fullPath = path.resolve(file);
            const content = fs.readFileSync(fullPath, "utf-8");
            const doc = Markdoc.parse(content);
            const info = PostSchema.parse(yaml.load(doc.attributes.frontmatter));
            const date = info.date;
            return { href, info, date, readingTime: readingTime(content) };
        })
        .toSorted((a, b) => (a.date < b.date ? 1 : -1));
};

export function Posts(props: { search: string }) {
    const items = getPosts();
    if (process.env.NODE_ENV !== "production") {
        fs.writeFileSync(POSTS_PATH, JSON.stringify(items, null, 4), "utf-8");
    }
    const filter = filterPosts(props.search, items);
    return (
        <QuickLinks>
            {filter.map((post) => {
                return (
                    <QuickLink
                        date={post.info.date}
                        readingTime={post.readingTime}
                        tags={post.info.subjects}
                        description={post.info.description}
                        href={post.href}
                        key={post.href}
                        title={post.info.title}
                    />
                );
            })}
        </QuickLinks>
    );
}
