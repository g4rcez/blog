import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { Comments, MarkdownPost, WhoIsNext } from "~/components/post";
import { Format } from "~/lib/format";
import { Posts } from "~/lib/posts";
import { SEO } from "~/lib/SEO";
import { me } from "~/me";
import "../../../styles/markdown.css";

export default async function PostPage(props: any) {
    const content = await Posts.content(props.params.slug);
    if (!content) return notFound();
    const { post, adjacentPosts, mdx } = content;
    const date = Format.date(post.date);
    const hasNext = adjacentPosts?.next !== null;

    return (
        <section className="block w-full min-w-full px-4 md:px-0">
            <header className="mb-8 w-full container flex flex-col flex-wrap">
                <time className="text-xs">
                    {date} | Tempo de leitura: {post.readingTime} min
                </time>
                <h2 className="mt-4 mb-2 gap-4 items-center font-extrabold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
                    <Link
                        href="/"
                        className="p-2 dark:text-indigo-50 text-indigo-300 h-fit link:text-indigo-400 border rounded-full link:underline border-indigo-300 link:border-indigo-400 transition-colors duration-300"
                    >
                        <ChevronLeftIcon />
                    </Link>
                    {post.title}
                </h2>
                <p className="mt-4 mb-2 text-xs">{post.description}</p>
            </header>
            <MarkdownPost post={post} mdx={mdx} />
            <Comments />
            <div className="w-full flex justify-between mt-8 border-t border-code-bg pt-4">
                {adjacentPosts.prev !== null && (
                    <WhoIsNext {...adjacentPosts.prev} label="prev" className="text-left" />
                )}
                {hasNext && <WhoIsNext {...adjacentPosts.next!} label="next" className="text-right" />}
            </div>
        </section>
    );
}

export const generateMetadata = async (props: any): Promise<Metadata> => {
    const id = props.params.slug;
    const content = await Posts.content(id);
    if (!content) return notFound();
    const openGraphImage = `https://garcez.dev/post-graph/${content.post.id}.webp`;
    const postUrl = `https://garcez.dev/post/${content.post.id}`;
    const seo = SEO.Post({ post: content.post, postUrl, openGraphImage });
    return {
        creator: "Allan Garcez",
        description: content.post.description,
        title: content.post.title,
        metadataBase: new URL(me.page),
        keywords: content.post.subjects,
        authors: me.contacts.map((x) => ({ name: x.label, url: x.link })),
        themeColor: [
            { media: "(prefers-color-scheme: light)", color: "#475569" },
            { media: "(prefers-color-scheme: dark)", color: "black" },
        ],
        ...seo,
    };
};
