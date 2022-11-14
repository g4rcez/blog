import { OmitKeys } from "lib/utility.types";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { RiLink } from "react-icons/ri";
import { PrismAsyncLight as Syntax } from "react-syntax-highlighter";
import { Format } from "../lib/format";
import { Themes, useTheme } from "./theme.config";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Input from "the-mask-input";

type Tag = "a" | typeof Link;

type Props = OmitKeys<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "ref" | "href"
> & {
  tag?: Tag;
  href: string;
};
export const Anchor = ({ tag: Tag = Link, ...props }: Props) => {
  return (
    <Tag
      className={`link:underline underline-offset-4 link:text-sky-600 dark:link:text-sky-400 transition-colors duration-200 ${
        props.className ?? ""
      }`}
      {...props}
      passHref
    >
      {props.children}
    </Tag>
  );
};

const HX = ({
  tag: Render,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
> & { tag: `h${2 | 3 | 4 | 5 | 6}` }) => {
  const [text, setText] = useState("");
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!span.current) return;
    setText(Format.slug(span.current.innerText));
  }, []);

  return (
    <Render {...props} id={props.id ?? text}>
      <Anchor className="font-extrabold no-underline group" href={`#${text}`}>
        <button className="inline-block transition-opacity duration-300 opacity-0 group-hover:opacity-100 rotate-45 mr-2 text-lg">
          <RiLink aria-hidden="true" className="rotate-45" />
        </button>
        <span ref={span}>{props.children}</span>
      </Anchor>
    </Render>
  );
};

const Pre = (props: any) => {
  const { className, children } = props.children.props;
  const lang = (className ?? "").replace("language-", "");
  const [theme] = useTheme();
  const [codeStyle, setCodeStyle] = useState<any>({});

  useEffect(() => {
    const async = async () => {
      const css =
        theme === Themes.Dark
          ? await import("./dracula.theme")
          : await import("./material-light.theme");
      return setCodeStyle(css.default);
    };
    async();
  }, [theme]);

  return (
    <Syntax
      showLineNumbers
      language={lang}
      className="text-lg my-4 border dark:border-transparent border-slate-200"
      style={{ ...codeStyle, fontFamily: "monospace" }}
      codeTagProps={{ style: { fontFamily: "'Fira Code', monospace" } }}
    >
      {children?.trim?.()}
    </Syntax>
  );
};

export const MdxComponents = {
  pre: Pre,
  Input: (props:any) => <Input {...props} className="p-2 border border-slate-300 dark:border-slate-400 rounded bg-transparent" />,
  img: (props: any) => (
    <img
      {...props}
      className={`block min-w-full w-full m-0 p-0 ${props.className}`}
    />
  ),
  h1: (props: any) => <HX {...props} tag="h2" />,
  h2: (props: any) => <HX {...props} tag="h2" />,
  h3: (props: any) => <HX {...props} tag="h3" />,
  h4: (props: any) => <HX {...props} tag="h4" />,
  h5: (props: any) => <HX {...props} tag="h5" />,
  h6: (props: any) => <HX {...props} tag="h6" />,
};

export const Markdown = (props: { mdx: MDXRemoteSerializeResult }) => (
  <Fragment>
    <MDXRemote
      scope={props.mdx.scope}
      compiledSource={props.mdx.compiledSource}
      components={MdxComponents}
    />
  </Fragment>
);
