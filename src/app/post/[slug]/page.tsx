import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Comments, MarkdownPost, WhoIsNext } from "~/components/post";
import { Format } from "~/lib/format";
import { toMarkdown } from "~/lib/markdown";
import { Posts } from "~/lib/posts";
import { SEO } from "~/lib/SEO";
import "../../../styles/markdown.css";

type AdjacentPosts = {
  next: Posts.Post | null;
  prev: Posts.Post | null;
};

const getContent = async (slug: string) => {
  const post = Posts.find(slug);
  if (post === null) return null;
  const adjacentPosts = Posts.all().reduce<AdjacentPosts>(
    (acc, el, index, array) => {
      if (el.id === post.id) {
        const next = array[index + 1] ?? null;
        const prev = array[index - 1] ?? null;
        return { next, prev };
      }
      return acc;
    },
    { next: null, prev: null }
  );
  return { post, adjacentPosts, mdx: await toMarkdown(post.content || "") };
};

export default async function PostPage(props: any) {
  const content = await getContent(props.params.slug);
  if (!content) return <p>Not found</p>;
  const { post, adjacentPosts, mdx } = content;
  const date = Format.date(post.date);
  const openGraphImage = `https://garcez.dev/post-graph/${post.id}.png`;
  const hasNext = adjacentPosts?.next !== null;
  const postUrl = `https://garcez.dev/post/${post.id}`;

  return (
    <section className="block w-full min-w-full px-4 md:px-0">
      <Head>
        <SEO.Post
          post={post}
          postUrl={postUrl}
          openGraphImage={openGraphImage}
        />
      </Head>
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
          <WhoIsNext
            {...adjacentPosts.prev}
            label="prev"
            className="text-left"
          />
        )}
        {hasNext && (
          <WhoIsNext
            {...adjacentPosts.next!}
            label="next"
            className="text-right"
          />
        )}
      </div>
    </section>
  );
}
