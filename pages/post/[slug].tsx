import { getAllPosts, getPostBySlug, toMarkdown } from "../../lib/markdown";
import type { Post } from "../../lib/markdown";
import { useMemo, useState } from "react";
import { Format } from "../../lib/format";
import Head from "next/head";

type Params = {
  params: {
    slug: string;
  };
};

const allPostInfo: (keyof Post)[] = [
  "title",
  "readingTime",
  "date",
  "slug",
  "description",
  "subjects",
  "content",
  "image",
];

export async function getStaticPaths() {
  const posts = getAllPosts(allPostInfo);
  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, allPostInfo);
  const content = await toMarkdown(post.content || "");
  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

type Props = {
  post: Post;
};

export const Component = ({ post }: Props) => {
  const date = useMemo(() => Format.date(post.date), [post]);
  return (
    <section className="flex flex-col w-full">
      <Head>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.subjects.join(",")} />
        <title>Garcez Blog | {post.title}</title>
      </Head>
      <header className="mb-8">
        <h1 className="font-bold text-5xl">{post.title}</h1>
        <p className="prose mt-4 mb-2">{post.description}</p>
        <time className="text-md prose">{date}</time>
      </header>
      <div
        className="markdown prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </section>
  );
};

export default Component;
