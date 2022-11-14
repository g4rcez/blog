import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Anchor, Markdown } from "./mdx";
import { Format } from "../lib/format";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

type Heading = { id: string; text: string; order: number };

export const parseTextHeaders = (html: Document) =>
  Array.from(html.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((hx): Heading => {
    const text = hx.textContent || "";
    return {
      text,
      id: Format.slug(text),
      order: Number.parseInt(hx.tagName.replace(/h/i, "")) - 2,
    };
  });

const initialState = () => ({ content: null, toc: null });

const Toc = ({ headers }: { headers: Heading[] }) => (
  <header>
    <hr className="dark:border-slate-700 border-slate-300" />
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
    <hr className="dark:border-slate-700 border-slate-300" />
  </header>
);

type State = {
  content: FunctionComponent | null;
  toc: FunctionComponent | null;
};

export const useTableOfContent = (mdx: MDXRemoteSerializeResult) => {
  const [Content, setContent] = useState<State>(initialState);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const createTableContent = () => {
      if (ref.current === null) return;
      const html = new DOMParser().parseFromString(
        ref.current.innerHTML,
        "text/html"
      );
      setContent({
        content: (<Markdown mdx={mdx} />) as any,
        toc: () => <Toc headers={parseTextHeaders(html)} />,
      });
    };
    if (ref.current === null) return;
    createTableContent();
    const observer = new MutationObserver(createTableContent);
    observer.observe(ref.current, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  return [Content, ref] as const;
};
