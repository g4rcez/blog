import { DocsHeader } from "@/components/docs-header";
import { PrevNextLinks } from "@/components/prev-next-links";
import { Prose } from "@/components/prose";
import { RelatedPosts } from "@/components/server/related-posts";
import { TableOfContents } from "@/components/table-of-contents";
import { localeFromPath, removeLocalePath } from "@/lib/seo";
import { collectSections } from "@/lib/sections";
import { type Node } from "@markdoc/markdoc";
import { headers } from "next/headers";
import React, { Fragment, Suspense } from "react";

type Frontmatter = {
    title: string;
    type: string;
    description: string;
    subjects?: string[];
    name?: string;
    source?: string;
};

type Props = {
    nodes: Array<Node>;
    frontmatter: Frontmatter;
    children: React.ReactNode;
};

export const DocsLayout = async ({ children, frontmatter, nodes }: Props) => {
    const tableOfContents = collectSections(nodes);
    const h = await headers();
    const pathname = h.get("x-pathname") || "";
    const lang = localeFromPath(pathname);
    const isPost = removeLocalePath(lang, pathname).startsWith("/posts/");
    return (
        <Fragment>
            <Suspense fallback={null}>
                {frontmatter.type === "index" ? null : <TableOfContents tableOfContents={tableOfContents} />}
            </Suspense>
            <div className="mx-auto min-w-0 max-w-[75ch] flex-auto pt-10 pb-24 sm:pt-14 xl:col-start-2 xl:row-start-1 xl:pt-16">
                <article>
                    <DocsHeader
                        title={frontmatter.title}
                        description={frontmatter.description}
                        tags={frontmatter.subjects}
                        name={frontmatter.name}
                        source={frontmatter.source}
                        type={frontmatter.type}
                    />
                    <Prose>{children}</Prose>
                </article>
                {isPost ? (
                    <Suspense fallback={null}>
                        <RelatedPosts lang={lang} />
                    </Suspense>
                ) : null}
                <PrevNextLinks />
            </div>
        </Fragment>
    );
};
