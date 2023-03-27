import Head from "next/head";
import { Fragment, useMemo } from "react";
import { Format } from "../../lib/format";
import { toMarkdown } from "../../lib/markdown";
import { useTableOfContent } from "../../components/table-of-content";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Markdown } from "../../components/mdx";
import { Projects } from "../../lib/projects";

type Params = { params: { slug: string } };

type Project = {
  readingTime: number;
  title: string;
  description?: string;
  date: string;
  slug: string;
  keywords: string[];
  content: string;
  npmName: string;
  npmLink: string;
};

export const getStaticPaths = () => ({
  fallback: false,
  paths: Projects.slugs().map((slug) => ({ params: { slug } })),
});

export const getStaticProps = async ({ params }: Params) => {
  const project = Projects.find(params.slug);
  return project === null
    ? { notFound: true }
    : { props: { post: project, mdx: await toMarkdown(project.content) } };
};

type Props = { post: Project; mdx: MDXRemoteSerializeResult };

export default function PostPage({ post, mdx }: Props) {
  const date = useMemo(() => Format.date(post.date), [post]);
  const openGraphImage = `https://garcez.dev/post-graph/${post.slug}.png`;
  const [Content, ref] = useTableOfContent();

  return (
    <section className="block w-full min-w-full">
      <Head>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(",")} />
        <title>Garcez Projects | {post.title ?? ""}</title>
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
      <header className="mb-6 w-full container flex flex-col flex-wrap">
        <h1 className="mt-4 mb-2 font-extrabold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {post.title}
        </h1>
        <p className="mt-2 mb-2 text-sm">{post.description}</p>
      </header>
      <nav className="table-of-content mb-8">
        <Fragment>
          <h2 className="text-xl font-bold mb-2">Table of Content</h2>
          {Content.toc && <Content.toc />}
        </Fragment>
      </nav>
      <section
        ref={ref}
        data-post={post.title}
        className="markdown block w-full min-w-full leading-relaxed antialiased tracking-wide break-words dark:text-slate-200"
      >
        <Markdown mdx={mdx} />
      </section>
    </section>
  );
}
