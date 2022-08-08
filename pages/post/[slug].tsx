import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { Format, toPost } from "../../lib/format";
import type { Post } from "../../lib/markdown";
import { getAllPosts, getPostBySlug, toMarkdown } from "../../lib/markdown";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react/lib";
import { unified } from "unified";
import { Anchor, MdxComponents } from "../../components/mdx";
import { Fragment, createElement, FunctionComponent } from "react";

export const rehype = async (text: string) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      Fragment: Fragment,
      components: MdxComponents,
      createElement: createElement as any,
    })
    .process(text);

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
  fallback: false,
  paths: getAllPosts(allPostInfo).map((post) => ({
    params: { slug: post.slug },
  })),
});

type AdjacentPosts = {
  next: Partial<Post> | null;
  prev: Partial<Post> | null;
};

export const getStaticProps = async ({ params }: Params) => {
  const post = getPostBySlug(params.slug, allPostInfo);
  const adjacentPosts = getAllPosts([
    "slug",
    "title",
    "date",
  ]).reduce<AdjacentPosts>(
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
  return {
    props: {
      adjacentPosts,
      post: {
        ...post,
        content: await toMarkdown(post.content || ""),
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

type Heading = { id: string; text: string; order: number };

const parseTextHeaders = (html: Document) =>
  Array.from(html.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((hx): Heading => {
    const text = hx.textContent || "";
    return {
      text,
      id: Format.slug(text),
      order: Number.parseInt(hx.tagName.replace(/h/i, "")) - 2,
    };
  });

type State = {
  content: FunctionComponent<{}> | null;
  toc: FunctionComponent<{}> | null;
};

const initialState = () => ({ content: null, toc: null });

const Toc = ({ headers }: { headers: Heading[] }) => (
  <ul className="my-4">
    {headers.map((hx) => (
      <li
        key={`${hx.id}-${hx.order}`}
        className="my-2 text-sm underline underline-offset-4"
        data-order={hx.order}
      >
        <Anchor href={`#${hx.id}`}>{hx.text}</Anchor>
      </li>
    ))}
  </ul>
);

export default function PostPage({ post, adjacentPosts }: Props) {
  const date = useMemo(() => Format.date(post.date), [post]);
  const hasNext = adjacentPosts.next === null;
  const ref = useRef<HTMLDivElement>(null);
  const [Content, setContent] = useState<State>(initialState);

  useEffect(() => {
    const createTableContent = async () => {
      if (ref.current === null) return;
      const file = await rehype(post.content);
      const html = new DOMParser().parseFromString(
        file.toString(),
        "text/html"
      );
      setContent({
        content: file.result as any,
        toc: () => <Toc headers={parseTextHeaders(html)} />,
      });
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
        <meta name="twitter:image:src" content={openGraphImage} />
        <meta name="twitter:site" content="@garcez.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="g4rcez/blog: O lugar do rascunho de ideias"
        />
        <link href="/prism.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
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
        <h1 className="mt-4 mb-2 font-bold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {post.title}
        </h1>
        <p className="mt-4 mb-2 text-sm">{post.description}</p>
        <time className="text-md text-sm">
          {date} | {post.readingTime} min read
        </time>
      </header>
      <nav className="table-of-content my-8">
        <Fragment>
          <h2 className="text-xl font-bold mb-2">Table of Content</h2>
          {Content.toc && <Content.toc />}
        </Fragment>
      </nav>
      <section
        ref={ref}
        className="markdown block w-full min-w-full leading-relaxed antialiased tracking-wide break-words dark:text-slate-200"
      >
        <Fragment>{Content.content as any}</Fragment>
      </section>
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
            {...adjacentPosts.next!}
            label="next"
            className="text-right"
          />
        )}
      </div>
    </section>
  );
}
