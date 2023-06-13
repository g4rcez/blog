import { OmitKeys } from "~/lib/utility.types";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { RxFrame } from "react-icons/rx";
import { PrismAsyncLight as Syntax } from "react-syntax-highlighter";
import { Format } from "~/lib/format";
import { Themes, useTheme } from "./theme.config";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Input from "the-mask-input";
import { Cookie } from "storage-manager-js";

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

export const Anchor = ({ tag: Tag = Link, ...props }: Props) => (
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
    <Render {...props} id={props.id ?? text} data-tag={Render}>
      <Anchor className="font-extrabold no-underline group" href={`#${text}`}>
        <span className="inline-block duration-300 mr-2 text-lg opacity-30 transition-opacity active:opacity-100 group-hover:opacity-100">
          <RxFrame className="mb-3" aria-hidden="true" />
        </span>
        <span ref={span}>{props.children}</span>
      </Anchor>
    </Render>
  );
};

type PreTheme = {
  [Themes.Dark]: null | {};
  [Themes.Light]: null | {};
};

const Pre = (props: any) => {
  const { className, children } = props.children.props;
  const lang = (className ?? "").replace("language-", "");
  const [theme] = useTheme();
  const [codeStyle, setCodeStyle] = useState<any>({});
  const ref = useRef<PreTheme>({ [Themes.Dark]: null, [Themes.Light]: null });

  useEffect(() => {
    const async = async () => {
      const cache = ref.current[theme];
      if (cache === null) {
        const css =
          theme === Themes.Dark
            ? await import("./dracula.theme")
            : await import("./material-light.theme");
        ref.current[theme] = css.default;
        return setCodeStyle(css.default);
      }
      return setCodeStyle(ref.current[theme]);
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

const CookiesComponent = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("name");
    Cookie.set("cookies-blog-test", input, {
      multiDomain: true,
      path: "garcez.dev",
    });
  };

  return (
    <div className="w-full border dark:border-slate-700 border-slate-300 rounded-xl p-6">
      <h3 className="!mt-0" data-toc="true">
        Setando cookies
      </h3>
      <p>
        O cookie criado será <b>cookies-blog-test</b>
      </p>
      <form className="flex gap-4 my-4" onSubmit={onSubmit}>
        <Input
          name="name"
          placeholder="Valor do cookie"
          className="border rounded-lg p-1 px-2 border-slate-200 dark:border-slate-700 bg-transparent"
        />
        <button
          type="submit"
          className="transition-colors duration-300 bg-blue-600 rounded-lg link:bg-blue-800 px-4 py-1"
        >
          Criar cookie
        </button>
      </form>
      <div className="flex items-center gap-4">
        <a href="https://garcez.dev/post/cookies">Ir para garcez.dev</a>
        <a href="https://blog.garcez.dev/post/cookies">
          Ir para blog.garcez.dev
        </a>
        <button
          onClick={() => alert(JSON.stringify(Cookie.json(), null, 4))}
          className="transition-colors duration-300 bg-blue-600 rounded-lg link:bg-blue-800 px-4 py-1"
        >
          Visualizar cookies
        </button>
      </div>
    </div>
  );
};

export const MdxComponents = {
  pre: Pre,
  Input: (props: any) => (
    <Input
      {...props}
      className="p-2 border border-slate-300 dark:border-slate-400 rounded bg-transparent"
    />
  ),
  img: (props: any) => (
    <img
      {...props}
      loading="lazy"
      className={`block min-w-full w-full m-0 p-0 ${props.className}`}
    />
  ),
  h1: (props: any) => <HX {...props} tag="h1" />,
  h2: (props: any) => <HX {...props} tag="h2" />,
  h3: (props: any) => <HX {...props} tag="h3" />,
  h4: (props: any) => <HX {...props} tag="h4" />,
  h5: (props: any) => <HX {...props} tag="h5" />,
  h6: (props: any) => <HX {...props} tag="h6" />,
  Cookies: CookiesComponent,
};

export const Markdown = (props: { mdx: MDXRemoteSerializeResult }) => (
  <Fragment>
    <MDXRemote
      frontmatter={null}
      scope={props.mdx.scope}
      components={MdxComponents}
      compiledSource={props.mdx.compiledSource}
    />
  </Fragment>
);