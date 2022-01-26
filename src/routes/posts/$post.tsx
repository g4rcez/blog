import { getMDXComponent } from "mdx-bundler/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { Anchor } from "~/components/anchor";
import { MdxComponents } from "~/components/mdx-components";
import { Files } from "~/lib/files.server";
import { compileMdx } from "~/lib/mdx.server";
import { Strings } from "~/lib/strings";

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.post as string;
  const result = await compileMdx(params.post as string);
  return json({ code: result?.code, slug, post: Files.parsePostFile(result?.post!, slug, result?.content!) }, result === null ? 404 : 200);
};

export const meta: MetaFunction = ({ data }) => {
  const title: string = data.slug;
  return {
    title,
    "og:title": title,
  };
};

type LoaderData = { code: string | null; post: Files.PostFile };

type Heading = { id: string; text: string; order: number };

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);
  const Component = useMemo(() => (data.code === null ? null : getMDXComponent(data.code)), [data.code]);

  useEffect(() => {
    if (!mainRef.current) return;
    setHeadings(
      Array.from(mainRef.current.querySelectorAll("h2,h3,h4,h5,h6")).map((hx): Heading => {
        const text = hx.textContent || "";
        const id = Strings.slugify(text);
        hx.id = id;
        return { id, text, order: Number.parseInt(hx.tagName.replace(/h/i, "")) - 2 };
      })
    );
  }, [data]);

  if (Component === null) return <div>Not found</div>;

  return (
    <div className="mx-auto container w-full max-w-6xl">
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-5xl font-extrabold capitalize leading-snug">{data.post.title}</h1>
          <small>
            <time>{new Date(data.post.date).toDateString()}</time> — {data.post.readingTime} min read
          </small>
        </div>
        <nav>
          <ul className="my-4">
            {headings.map((hx) => (
              <li key={`${hx.id}-${hx.order}`} className="my-2 text-sm underline underline-offset-4" data-order={hx.order}>
                <Anchor href={`#${hx.id}`}>{hx.text}</Anchor>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main
        ref={mainRef}
        className="py-2 max-w-6xl prose prose-slate dark:prose-invert prose-a:text-sky-700 dark:prose-a:text-sky-400 dark:prose-a:prose-headings:text-current prose-a:prose-headings:text-current prose-a:underline-offset-4"
      >
        <Component components={MdxComponents} />
      </main>
    </div>
  );
}
