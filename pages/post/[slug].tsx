import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { useEffect } from "react";
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

export const getStaticPaths = () => ({
  paths: getAllPosts(allPostInfo).map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  }),
  fallback: false,
});

export const getStaticProps = async ({ params }: Params) => {
  const post = getPostBySlug(params.slug, allPostInfo);
  const adjacentPosts = getAllPosts(["slug", "title", "date"]).reduce(
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
};

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

const Tags = {
  H1: "ml-0",
  H2: "ml-8",
  H3: "ml-16",
  H4: "ml-24",
  H5: "ml-32",
  H6: "ml-40",
};

type Tag = keyof typeof Tags;

type Heading = {
  text: string;
  id: string;
  tag: Tag;
};

export const Component = ({ post, adjacentPosts }: Props) => {
  const date = useMemo(() => Format.date(post.date), [post]);
  const hasNext = adjacentPosts.next === null;
  const ref = useRef<HTMLDivElement>(null);
  const [titles, setTitles] = useState<Heading[]>([]);

  useEffect(() => {
    const createTableContent = () => {
      const headings = ref.current.querySelectorAll("h1,h2,h3,h4,h5,h6");
      const list: Heading[] = [...headings].map((x) => {
        const id = Format.slug(x.textContent);
        x.id = id;
        return {
          id: Format.slug(x.textContent),
          text: x.textContent,
          tag: x.tagName as Tag,
        };
      });
      setTitles(list);
    };
    if (ref.current === null) return;
    createTableContent();
    const observer = new MutationObserver(createTableContent);
    observer.observe(ref.current, { subtree: true, childList: true });
    return () => {
      observer.disconnect();
    };
  }, []);

  const openGraphImage = `https://garcez.dev/post-graph/${post.slug}.png`;

  return (
    <section className="block w-full min-w-full">
      <Head>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.subjects.join(",")} />
        <title>Garcez Blog | {post.title}</title>
        <link rel="stylesheet" href="/markdown.css" as="style" />

        <meta name="twitter:image:src" content={openGraphImage} />
        <meta name="twitter:site" content="@garcez.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="g4rcez/blog: O lugar do rascunho de ideias"
        />
        <meta name="twitter:description" content={post.description} />
        <meta property="og:image" content={openGraphImage} />
        <meta property="og:image:alt" content={post.description} />
        <meta property="og:image:width" content="1050" />
        <meta property="og:image:height" content="280" />
        <meta property="og:site_name" content="Blog do Garcez" />
        <meta property="og:type" content="object" />
        <meta
          property="og:title"
          content="g4rcez/blog: O lugar do rascunho de ideias"
        />
        <meta
          property="og:url"
          content={`https://garcez.dev/post/${post.slug}`}
        />
      </Head>
      <header className="mb-8 w-full container flex flex-col flex-wrap">
        <h1 className="prose mt-4 mb-2 font-bold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {post.title}
        </h1>
        <p className="prose mt-4 mb-2 text-sm">{post.description}</p>
        <time className="text-md prose text-sm">
          {date} | {post.readingTime} min read
        </time>
      </header>
      <section className="table-of-content my-8">
        <h2 className="text-xl font-bold mb-2">Table of Content</h2>
        <ul className="my-4">
          {titles.map((x) => (
            <li
              key={x.id}
              className={`transition-colors my-1 duration-500 hover:underline text-primary-link hover:text-primary ${
                Tags[x.tag]
              }`}
            >
              <a href={`#${x.id}`}>{x.text}</a>
            </li>
          ))}
        </ul>
      </section>
      <section
        ref={ref}
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
