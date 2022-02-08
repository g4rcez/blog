import { useEffect, useRef, useState } from "react";
import { RiLink } from "react-icons/ri";
import { PrismAsyncLight as Syntax } from "react-syntax-highlighter";
import { Strings } from "~/lib/strings";
import { Themes } from "~/lib/theme";
import { Anchor } from "./anchor";
import { useTheme } from "./theme.provider";

const HX = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > & { tag: `h${2 | 3 | 4 | 5 | 6}` }
) => {
  const Render = props.tag;
  const [text, setText] = useState("");
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!span.current) return;
    setText(Strings.slugify(span.current.innerText));
  }, []);

  return (
    <Render {...props}>
      <Anchor className="font-extrabold no-underline group" to={`#${text}`}>
        <button className="inline-block opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-45 mr-2">
          <RiLink aria-hidden="true" className="rotate-45 text-base" />
        </button>
        <span ref={span}>{props.children}</span>
      </Anchor>
    </Render>
  );
};

const Pre = (props: any) => {
  const { className, children } = props.children[0].props;
  const lang = (className ?? "").replace("language-", "");
  const [theme] = useTheme();
  const [codeStyle, setCodeStyle] = useState<any>({});

  useEffect(() => {
    const async = async () => {
      const css = await import(
        theme === Themes.Dark
          ? "react-syntax-highlighter/dist/cjs/styles/prism/dracula"
          : "react-syntax-highlighter/dist/cjs/styles/prism/material-light"
      );
      return setCodeStyle(css.default.default);
    };
    async();
  }, [theme]);

  return (
    <Syntax
      showLineNumbers
      language={lang}
      className="text-lg my-4 border dark:border-transparent"
      style={{ ...codeStyle, fontFamily: "monospace" }}
      codeTagProps={{ style: { fontFamily: "'Fira Code', monospace" } }}
    >
      {children[0].trim()}
    </Syntax>
  );
};

export const MdxComponents = {
  pre: Pre,
  h1: (props: any) => <HX {...props} tag="h2" />,
  h2: (props: any) => <HX {...props} tag="h2" />,
  h3: (props: any) => <HX {...props} tag="h3" />,
  h4: (props: any) => <HX {...props} tag="h4" />,
  h5: (props: any) => <HX {...props} tag="h5" />,
  h6: (props: any) => <HX {...props} tag="h6" />,
  Custom: (props: any) => <h1>CUSTOM</h1>,
};
