import {
  createElement,
  Fragment,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { Anchor } from "~/components/anchor";
import { Container } from "~/components/container";
import { MdxComponents } from "~/components/mdx-components";
import { Posts } from "~/database/posts.server";
import { Http } from "~/lib/http";
import { Strings } from "~/lib/strings";
import ConfigJson from "../../config.json";
const ReactMarkdown = import("react-markdown").then((v) => v.default);

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.post as string;
  const post = await Posts.findOne(slug);
  if (post === null)
    return json({ message: `Not found ${slug}` }, Http.StatusNotFound);
  return json({ code: post.content, post, url: request.url }, 200);
};

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
  code: string | null;
  post: NonNullable<Posts.PostDetailed>;
};

type Heading = { id: string; text: string; order: number };

//let ReactMarkdown: any = null;

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    setHeadings(
      Array.from(mainRef.current.querySelectorAll("h2,h3,h4,h5,h6")).map(
        (hx): Heading => {
          const text = hx.textContent || "";
          const id = Strings.slugify(text);
          hx.id = id;
          return {
            id,
            text,
            order: Number.parseInt(hx.tagName.replace(/h/i, "")) - 2,
          };
        }
      )
    );
  }, [data]);

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
        <nav>
          <ul className="my-4">
            {headings.map((hx) => (
              <li
                key={`${hx.id}-${hx.order}`}
                className="my-2 text-sm underline underline-offset-4"
                data-order={hx.order}
              >
                <Anchor to={`#${hx.id}`}>{hx.text}</Anchor>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <section
        ref={mainRef}
        className="py-2 max-w-6xl prose prose-slate dark:prose-invert prose-a:text-sky-700 dark:prose-a:text-sky-400 dark:prose-a:prose-headings:text-current prose-a:prose-headings:text-current prose-a:underline-offset-4"
      >
        <ReactMarkdown children={data.code ?? ""} components={MdxComponents} />
      </section>
    </Container>
  );
}
