import { QuickLink, QuickLinks } from "@/components/quick-links";
import { filterPosts, PostSchema, readingTime } from "@/lib/models";
import Markdoc from "@markdoc/markdoc";
import glob from "fast-glob";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

const getPosts = () =>
    glob
        .sync(path.resolve(path.join(process.cwd(), "src", "app", "posts", "**", "page.md")))
        .map((file) => {
            const href = file.replace(/\/page\.mdx?$/, "").replace("src/app", "");
            const fullPath = path.resolve(file);
            const content = fs.readFileSync(fullPath, "utf-8");
            const doc = Markdoc.parse(content);
            const info = PostSchema.parse(yaml.load(doc.attributes.frontmatter));
            const date = info.date;
            return { href, info, content, filename: file, date };
        })
        .toSorted((a, b) => (a.date < b.date ? 1 : -1));

export function Posts(props: { search: string }) {
    const items = getPosts();
    const filter = filterPosts(props.search, items);
    return (
        <QuickLinks>
            {filter.map(({ info, href, filename, content }) => {
                return (
                    <QuickLink
                        date={info.date}
                        readingTime={readingTime(content)}
                        tags={info.subjects}
                        description={info.description}
                        href={href}
                        key={filename}
                        title={info.title}
                    />
                );
            })}
        </QuickLinks>
    );
}
