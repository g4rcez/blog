import Markdoc from "@markdoc/markdoc";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const FrontmatterSchema = z.object({
    title: z.string(),
    description: z.string(),
    subjects: z.array(z.string()).default([]),
});

export type PageFrontmatter = z.infer<typeof FrontmatterSchema>;

const appDir = path.resolve(process.cwd(), "src", "app");

export const getPageFrontmatter = (routePath: string): PageFrontmatter => {
    const file = path.join(appDir, routePath, "page.md");
    const content = fs.readFileSync(file, "utf-8");
    const doc = Markdoc.parse(content);
    const raw = yaml.load(doc.attributes.frontmatter);
    return FrontmatterSchema.parse(raw);
};
