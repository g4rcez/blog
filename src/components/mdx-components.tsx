import { Strings } from "~/lib/strings";
import { Anchor } from "./anchor";
import { RiLink } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { PrismAsyncLight as Syntax } from "react-syntax-highlighter";
import codeStyle from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";

const HX = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & { tag: `h${2 | 3 | 4 | 5 | 6}` }) => {
  const Render = props.tag;
  const [text, setText] = useState("");
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!span.current) return;
    setText(Strings.slugify(span.current.innerText));
  }, []);

  return (
    <Render {...props}>
      <Anchor className="font-extrabold no-underline group" href={`#${text}`}>
        <button className="inline-block opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-45 mr-2">
          <RiLink aria-hidden="true" className="rotate-45 text-base" />
        </button>
        <span ref={span}>{props.children}</span>
      </Anchor>
    </Render>
  );
};

export const MdxComponents = {
  pre: (props: any) => {
    const { className, children } = props.children.props;
    const lang = (className ?? "").replace("language-", "");
    return (
      <Syntax showLineNumbers language={lang} className="text-lg my-4" style={{ ...codeStyle, fontFamily: "monospace" }}>
        {children.trim()}
      </Syntax>
    );
  },
  h1: (props: any) => <HX {...props} tag="h2" />,
  h2: (props: any) => <HX {...props} tag="h2" />,
  h3: (props: any) => <HX {...props} tag="h3" />,
  h4: (props: any) => <HX {...props} tag="h4" />,
  h5: (props: any) => <HX {...props} tag="h5" />,
  h6: (props: any) => <HX {...props} tag="h6" />,
  Custom: (props: any) => <h1>CUSTOM</h1>,
};
