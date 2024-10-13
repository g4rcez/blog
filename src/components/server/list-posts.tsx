import { QuickLink, QuickLinks } from "@/components/quick-links";
import { filterPosts, PostSchema, readingTime } from "@/lib/models";
import Markdoc from "@markdoc/markdoc";
import glob from "fast-glob";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

const base = path.resolve(path.join(process.cwd(), "src", "app"));

export const getPosts = () =>
    glob
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

const items = getPosts();

export function Posts(props: { search: string }) {
    const filter = filterPosts(props.search, items);
    return (
        <QuickLinks>
            {filter.map((post) => (
                <QuickLink
                    date={post.info.date}
                    readingTime={post.readingTime}
                    tags={post.info.subjects}
                    description={post.info.description}
                    href={post.href}
                    key={post.href}
                    title={post.info.title}
                />
            ))}
        </QuickLinks>
    );
}
