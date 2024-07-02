import { QuickLink, QuickLinks } from "@/components/quick-links";
import Markdoc from "@markdoc/markdoc";
import glob from "fast-glob";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const schema = z.object({
    title: z.string(),
    description: z.string(),
    level: z.coerce.number(),
    subjects: z.array(z.string()),
    translations: z.array(z.string()),
    language: z.string(),
    date: z.string(),
});

export function ListPosts() {
    const items = glob.sync("**/posts/**/*/page.md");
    return (
        <QuickLinks>
            {items.map((filename) => {
                const href = filename.replace(/\/page\.mdx?$/, "").replace("src/app", "");
                const fullPath = path.resolve(filename);
                const content = fs.readFileSync(fullPath, "utf-8");
                const doc = Markdoc.parse(content);
                const info = schema.parse(yaml.load(doc.attributes.frontmatter));
                return (
                    <QuickLink
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
