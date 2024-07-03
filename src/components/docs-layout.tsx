import { DocsHeader } from "@/components/docs-header";
import { PrevNextLinks } from "@/components/prev-next-links";
import { Prose } from "@/components/prose";
import { TableOfContents } from "@/components/table-of-contents";
import { collectSections } from "@/lib/sections";
import { type Node } from "@markdoc/markdoc";
import React, { Fragment, Suspense } from "react";

type Frontmatter = { title: string; type: string; description: string };

type Props = {
    children: React.ReactNode;
    frontmatter: Frontmatter;
    nodes: Array<Node>;
};

export const DocsLayout = ({ children, frontmatter, nodes }: Props) => {
    const tableOfContents = collectSections(nodes);
    return (
        <Fragment>
            <div className="min-w-0 max-w-7xl flex-auto px-2 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
                <article>
                    <DocsHeader title={frontmatter.title} description={frontmatter.description} />
                    <Prose>{children}</Prose>
                </article>
                <PrevNextLinks />
            </div>
            <Suspense fallback={null}>
                {frontmatter.type !== "index" ? <TableOfContents tableOfContents={tableOfContents} /> : null}
            </Suspense>
        </Fragment>
    );
};
