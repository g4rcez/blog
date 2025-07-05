import { nodes as defaultNodes, Tag } from "@markdoc/markdoc";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import yaml from "js-yaml";
import { DocsLayout } from "@/components/docs-layout";
import { Fence } from "@/components/fence";

const documentSlugifyMap = new Map();

const Img = {
    ...defaultNodes.image,
    selfClosing: true,
    attributes: {
        src: { type: String },
        alt: { type: String },
        caption: { type: String },
    },
    render: ({ src = "", caption = "", alt = "" }) => (
        <span className="markdown-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src.replace(/^\/public/g, "")} alt={alt} />
            <small>{caption || alt}</small>
        </span>
    ),
};

const nodes = {
    fence: {
        render: Fence,
        attributes: { language: { type: String }, twoslash: { type: Boolean } },
    },
    document: {
        ...defaultNodes.document,
        render: DocsLayout,
        transform(node, config) {
            documentSlugifyMap.set(config, slugifyWithCounter());
            return new Tag(
                this.render,
                { frontmatter: yaml.load(node.attributes.frontmatter), nodes: node.children },
                node.transformChildren(config),
            );
        },
    },
    heading: {
        ...defaultNodes.heading,
        transform(node, config) {
            const level = Math.max(node.attributes.level, 2);
            const slugify = documentSlugifyMap.get(config);
            const attributes = node.transformAttributes(config);
            const children = node.transformChildren(config);
            const text = children.filter((child) => typeof child === "string").join(" ");
            const id = attributes.id ?? slugify(text);
            return new Tag(`h${level}`, { ...attributes, "data-level": node.attributes.level, id }, children);
        },
    },
    th: {
        ...defaultNodes.th,
        attributes: { ...defaultNodes.th.attributes, scope: { type: String, default: "col" } },
    },
    image: Img,
};

export default nodes;
