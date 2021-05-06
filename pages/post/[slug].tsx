import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { Format, toPost } from "../../lib/format";
import type { Post } from "../../lib/markdown";
import { getAllPosts, getPostBySlug, toMarkdown } from "../../lib/markdown";

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
  const posts = getAllPosts(["slug", "title", "date"]);
  console.log(posts);
  const adjacentPosts = posts.reduce(
    (acc, el, index, array) => {
      if (el.slug === post.slug) {
        return {
          next: array[index + 1] ?? null,
          prev: array[index - 1] ?? null,
        };
      }
      return acc;
    },
    { next: null, prev: null }
  );
  const content = await toMarkdown(post.content || "");
  return {
    props: {
      adjacentPosts,
      post: {
        ...post,
        content,
      },
    },
  };
}

type Props = {
  post: Post;
  adjacentPosts: {
    next: Post | null;
    prev: Post | null;
  };
};

export const WhoIsNext = (
  props: Post & { label: "next" | "prev"; className: string }
) => {
  const icon = props.label === "next" ? "->" : "<-";
  const href = toPost(props.slug);
  return (
    <Link href={href}>
      <a
        href={href}
        className={
          "w-full hover:underline hover:text-primary-link cursor-pointer " +
          props.className
        }
      >
        {props.label === "prev" && <span className="mx-2">{icon}</span>}
        {props.title}
        {props.label === "next" && <span className="mx-2">{icon}</span>}
      </a>
    </Link>
  );
};

export const Component = ({ post, adjacentPosts }: Props) => {
  const date = useMemo(() => Format.date(post.date), [post]);
  const hasNext = adjacentPosts.next === null;
  return (
    <section className="block w-full min-w-full">
      <Head>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.subjects.join(",")} />
        <title>Garcez Blog | {post.title}</title>
      </Head>
      <header className="mb-8 w-full container mx-auto flex flex-col flex-wrap">
        <h1 className="prose mt-4 mb-2 font-bold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {post.title}
        </h1>
        <p className="prose mt-4 mb-2 text-sm">{post.description}</p>
        <time className="text-md prose text-sm">
          {date} | {post.readingTime} min read
        </time>
      </header>
      <section
        className="markdown prose lg:prose-xl block w-full min-w-full"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="w-full flex justify-between mt-8 border-t border-code-bg pt-4">
        {adjacentPosts.prev !== null && (
          <WhoIsNext
            {...adjacentPosts.prev}
            label="prev"
            className="text-left"
          />
        )}
        {!hasNext !== null && (
          <WhoIsNext
            {...adjacentPosts.next}
            label="next"
            className="text-right"
          />
        )}
      </div>
    </section>
  );
};

export default Component;
