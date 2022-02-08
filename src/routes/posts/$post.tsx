import React, { useEffect, useRef, useState } from "react";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { Anchor } from "~/components/anchor";
import { Container } from "~/components/container";
import { Posts } from "~/database/posts.server";
import { Http } from "~/lib/http";
import { markdown } from "~/lib/markdown.server";
import { rehype } from "~/lib/rehype";
import { Strings } from "~/lib/strings";
import ConfigJson from "../../config.json";

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.post as string;
  const post = await Posts.findOne(slug);
  if (post === null) {
    return json({ message: `Not found ${slug}` }, Http.StatusNotFound);
  }
  return json(
    { code: await markdown(post.content), post, url: request.url },
    200
  );
};

const parseTextHeaders = (html: Document) =>
  Array.from(html.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((hx): Heading => {
    const text = hx.textContent || "";
    return {
      text,
      id: Strings.slugify(text),
      order: Number.parseInt(hx.tagName.replace(/h/i, "")) - 2,
    };
  });

const initialState = () => ({ content: React.Fragment, toc: React.Fragment });

function useProcessor(text: string) {
  const [Content, setContent] = useState(initialState);

  useEffect(() => {
    const asyncCall = async () => {
      const file = await rehype(text);
      const html = new DOMParser().parseFromString(
        file.toString(),
        "text/html"
      );
      const headers = parseTextHeaders(html);
      setContent({
        content: file.result as never,
        toc: (
          <ul className="my-4">
            {headers.map((hx) => (
              <li
                key={`${hx.id}-${hx.order}`}
                className="my-2 text-sm underline underline-offset-4"
                data-order={hx.order}
              >
                <Anchor to={`#${hx.id}`}>{hx.text}</Anchor>
              </li>
            ))}
          </ul>
        ) as never,
      });
    };
    asyncCall();
  }, [text]);

  return Content;
}

export const meta: MetaFunction = ({ data }) => {
  const post: Posts.PostDetailed = data.post;
  if (post === null) return {} as never;
  const metaTags: Record<string, string> = {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, { tag: { label: "react-hooks" } }]
      .map((tag) => Strings.toTitle(tag.tag.label))
      .join(", "),
    "og:site": post.description,
    "og:title": post.title,
    "og:url": data.url as string,
    "og:description": post.description,

    "twitter:title": post.title,
    "twitter:card": "summary_large_image",
    "twitter:description": post.description,
  };

  if (ConfigJson.github) metaTags["twitter:site"] = `@${ConfigJson.github}`;
  if (ConfigJson.twitter)
    metaTags["twitter:creator"] = `@${ConfigJson.twitter}`;
  return metaTags;
};

type LoaderData = {
  code: Awaited<ReturnType<typeof markdown>>;
  post: NonNullable<Posts.PostDetailed>;
};

type Heading = { id: string; text: string; order: number };

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const mainRef = useRef<HTMLDivElement>(null);
  const processor = useProcessor(data.code);

  return (
    <Container>
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-5xl font-extrabold capitalize leading-snug">
            {data.post.title}
          </h1>
          <small>
            <time>{new Date(data.post.createdAt).toDateString()}</time> —{" "}
            {data.post.readingTime} min read
          </small>
        </div>
        <nav>{processor.toc}</nav>
      </header>
      <section
        ref={mainRef}
        className="py-2 max-w-6xl prose prose-slate dark:prose-invert prose-a:text-sky-700 dark:prose-a:text-sky-400 dark:prose-a:prose-headings:text-current prose-a:prose-headings:text-current prose-a:underline-offset-4"
      >
        {processor.content}
      </section>
    </Container>
  );
}
