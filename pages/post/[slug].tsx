import Head from "next/head";
import Link from "next/link";
import React, { useMemo } from "react";
import { Format } from "../../lib/format";
import { toMarkdown } from "../../lib/markdown";
import { useTableOfContent } from "../../components/table-of-content";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Markdown } from "../../components/mdx";
import { Posts } from "../../lib/posts";

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

  return (
    <section className="block w-full min-w-full">
      <Head>
        <title key="title">Garcez Blog | {post.title}</title>
        <link href="/prism.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
        <meta name="title" content={post.title} />
        <meta key="description" name="description" content={post.description} />
        <meta key="keywords" name="keywords" content={post.subjects.join(",")} />
        <meta
          key="og:description"
          property="og:description"
          content={post.description}
        />
        <meta property="og:image" content={openGraphImage} />
        <meta property="og:image:alt" content={post.description} />
        <meta property="og:image:height" content="280" />
        <meta property="og:image:width" content="1050" />
        <meta property="og:site_name" content="Blog do Garcez" />
        <meta property="og:title" content={`g4rcez/blog: ${post.title}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={postUrl} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          key="twitter:description"
          property="twitter:description"
          content={post.description}
        />
        <meta property="twitter:image" content={openGraphImage} />
        <meta property="twitter:image:src" content={openGraphImage} />
        <meta property="twitter:site" content="@garcez.dev" />
        <meta property="twitter:title" content={`g4rcez/blog: ${post.title}`} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:url" content={postUrl} />
      </Head>
      <header className="mb-8 w-full container flex flex-col flex-wrap">
        <h2 className="mt-4 mb-2 font-semibold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {post.title}
        </h2>
        <p className="mt-4 mb-2 text-sm">{post.description}</p>
        <time className="text-md text-sm">
          {date} | {post.readingTime} min read
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
