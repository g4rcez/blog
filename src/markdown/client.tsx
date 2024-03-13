"use client";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { PostMetadata } from "~/markdown/types";

const components = {};

export const MarkdownClient = (props: MDXRemoteSerializeResult) => {
    const metadata = props.frontmatter as PostMetadata;
    return (
        <main className="w-full container mx-auto">
            <header className="mb-6">
                <h1 className="text-4xl font-bold">{metadata.title}</h1>
                <h4>{metadata.description} - <i>{metadata.createdAt.toISOString()}</i></h4>
            </header>
            <section className="w-full">
                <MDXRemote {...props} components={components}/>
            </section>
        </main>
    );
};