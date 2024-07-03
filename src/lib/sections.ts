import { type Node } from "@markdoc/markdoc";
import { slugifyWithCounter } from "@sindresorhus/slugify";

interface HeadingNode extends Node {
    type: "heading";
    attributes: {
        level: 1 | 2 | 3 | 4 | 5 | 6;
        id?: string;
        [key: string]: unknown;
    };
}

type H2Node = HeadingNode & {
    attributes: {
        level: 2;
    };
};

type H3Node = HeadingNode & {
    attributes: {
        level: 3;
    };
};

function isHeadingNode(node: Node): node is HeadingNode {
    return (
        node.type === "heading" &&
        [1, 2, 3, 4, 5, 6].includes(node.attributes.level) &&
        (typeof node.attributes.id === "string" || typeof node.attributes.id === "undefined")
    );
}

const isHxNode =
    <N extends number>(n: N) =>
    (node: Node): node is HeadingNode & { attributes: { level: N } } =>
        isHeadingNode(node) && node.attributes.level === n;

const isHx = [isHxNode(1), isHxNode(2), isHxNode(3), isHxNode(4), isHxNode(5), isHxNode(6)];

function getNodeText(node: Node) {
    let text = "";
    for (let child of node.children ?? []) {
        if (child.type === "text") {
            text += child.attributes.content;
        }
        text += getNodeText(child);
    }
    return text;
}

export type Subsection = H3Node["attributes"] & {
    id: string;
    title: string;
    children?: undefined;
};

export type Section = H2Node["attributes"] & {
    id: string;
    title: string;
    children: Array<Subsection>;
};

export function collectSections(nodes: Array<Node>, slugify = slugifyWithCounter()) {
    const sections: Array<Section> = [];
    for (const node of nodes) {
        const isHeader = isHx.some((x) => x(node));
        if (isHeader) {
            const title = getNodeText(node);
            if (title) {
                let id = slugify(title);
                const level = node.attributes?.level || "";
                sections.push({ ...node.attributes, id, title, children: [], level });
            }
        }

        sections.push(...collectSections(node.children ?? [], slugify));
    }
    return sections;
}
