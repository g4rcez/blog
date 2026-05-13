import { DocsHeader } from "@/components/docs-header";
import { PrevNextLinks } from "@/components/prev-next-links";
import { Prose } from "@/components/prose";
import { RelatedPosts } from "@/components/server/related-posts";
import { TableOfContents } from "@/components/table-of-contents";
import { Locale } from "@/lib/dictionary";
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
    const lang: Locale = pathname.startsWith("/pt") ? "pt-BR" : "en-US";
    const isPost = pathname.startsWith("/posts/") || pathname.startsWith("/pt/posts/");
    return (
        <Fragment>
            <div className="min-w-0 max-w-7xl flex-auto px-2 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
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
            <Suspense fallback={null}>
                {frontmatter.type !== "index" ? <TableOfContents tableOfContents={tableOfContents} /> : null}
            </Suspense>
        </Fragment>
    );
};
