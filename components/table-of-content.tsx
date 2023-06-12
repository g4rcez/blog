import {
  Fragment,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Anchor } from "./mdx";
import { Format } from "../lib/format";

type Heading = { id: string; text: string; order: number };

const headersSelector = (node: HTMLDivElement) =>
  (
    Array.from(
      node.querySelectorAll("h1,h2,h3,h4,h5,h6")
    ) as HTMLHeadingElement[]
  ).filter((x) => x.dataset.toc !== "true");

export const parseTextHeaders = (headers: HTMLHeadingElement[]) =>
  headers.map((hx): Heading => {
    const text = hx.textContent || "";
    return {
      text,
      id: Format.slug(text),
      order: Number.parseInt(hx.dataset.tag?.replace(/h/i, "") ?? ""),
    };
  });

const initialState = () => ({ toc: Fragment });

const Toc = ({ headers }: { headers: Heading[] }) => (
  <header>
    <hr className="dark:border-slate-700 border-slate-300" />
    <ul className="my-4">
      {headers.map((hx) => (
        <li
          data-order={hx.order}
          key={`${hx.id}-${hx.order}`}
          style={{ marginLeft: `${hx.order * 24}px` }}
          className="my-4 text-sm underline underline-offset-4"
        >
          <Anchor href={`#${hx.id}`}>{hx.text}</Anchor>
        </li>
      ))}
    </ul>
    <hr className="dark:border-slate-700 border-slate-300" />
  </header>
);

type State = {
  toc: FunctionComponent;
};

export const useTableOfContent = () => {
  const [Content, setContent] = useState<State>(initialState);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const createTableContent = () => {
      if (ref.current === null) return;
      const headers = headersSelector(ref.current);
      const parsed = parseTextHeaders(headers);
      setContent({ toc: () => <Toc headers={parsed} /> });
    };
    if (ref.current === null) return;
    const observer = new MutationObserver(createTableContent);
    observer.observe(ref.current, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);

  return [Content, ref] as const;
};
