import Head from "next/head";
import Link from "next/link";
import React, { useMemo, useRef } from "react";
import { Format } from "../../lib/format";
import { toMarkdown } from "../../lib/markdown";
import { useTableOfContent } from "../../components/table-of-content";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Markdown } from "../../components/mdx";
import { Posts } from "../../lib/posts";
import { SEO } from "../../lib/SEO";
import { useComment } from "../../lib/use-comment";

type Params = {
  params: {
    slug: string;
  };
};

export const getStaticPaths = () => ({
  fallback: false,
  paths: Posts.slugs().map((slug) => ({ params: { slug } })),
});

type AdjacentPosts = {
  next: Partial<Posts.Post> | null;
  prev: Partial<Posts.Post> | null;
};

export const getStaticProps = async ({ params }: Params) => {
  const post = Posts.find(params.slug);
  if (post === null) return { notFound: true };
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
  return {
    props: {
      adjacentPosts,
      mdx: await toMarkdown(post.content || ""),
      post: {
        ...post,
        content: await toMarkdown(post.content || ""),
      },
    },
  };
};

type Props = {
  post: Posts.Post;
  mdx: MDXRemoteSerializeResult;
  adjacentPosts: {
    next: Posts.Post | null;
    prev: Posts.Post | null;
  };
};

export const WhoIsNext = (
  props: Posts.Post & { label: "next" | "prev"; className: string }
) => {
  const icon = props.label === "next" ? "->" : "<-";
  return (
    <Link
      href={props.href}
      className={
        "w-full hover:underline hover:text-primary-link cursor-pointer " +
        props.className
      }
    >
      {props.label === "prev" && <span className="mx-2">{icon}</span>}
      {props.title}
      {props.label === "next" && <span className="mx-2">{icon}</span>}
    </Link>
  );
};

export default function PostPage({ post, adjacentPosts, mdx }: Props) {
  const date = useMemo(() => Format.date(post.date), [post]);
  const [Content, ref] = useTableOfContent();
  const openGraphImage = `https://garcez.dev/post-graph/${post.id}.png`;
  const hasNext = adjacentPosts.next !== null;
  const postUrl = `https://garcez.dev/post/${post.id}`;
  const comment = useRef<HTMLDivElement | null>(null);
  useComment(comment);

  return (
    <section className="block w-full min-w-full">
      <Head>
        <link href="/prism.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
        <SEO.Post
          post={post}
          postUrl={postUrl}
          openGraphImage={openGraphImage}
        />
      </Head>
      <header className="mb-8 w-full container flex flex-col flex-wrap">
        <h2 className="mt-4 mb-2 font-extrabold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {post.title}
        </h2>
        <p className="mt-4 mb-2 text-sm">{post.description}</p>
        <time className="text-md text-sm">
          {date} | Tempo de leitura: {post.readingTime} min
        </time>
      </header>
      <nav className="table-of-content my-8">
        <Content.toc />
      </nav>
      <section
        ref={ref}
        data-post={post.title}
        className="markdown block w-full min-w-full leading-relaxed antialiased tracking-wide break-words dark:text-slate-200"
      >
        <Markdown mdx={mdx} />
      </section>
      <div className="w-full block min-w-full" ref={comment}></div>
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
