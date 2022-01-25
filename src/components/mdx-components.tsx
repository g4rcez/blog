import { Strings } from "~/lib/strings";
import { Anchor } from "./anchor";
import { RiLink } from "react-icons/ri";

const HX = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & { tag: `h${2 | 3 | 4 | 5 | 6}` }) => {
  const Render = props.tag;
  const text = Strings.slugify(props.children as string);
  return (
    <Render {...props}>
      <Anchor className="font-extrabold no-underline group" href={`#${text}`}>
        <button className="inline-block opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-45 mr-2">
          <RiLink aria-hidden="true" className="rotate-45 text-base" />
        </button>
        {props.children}
      </Anchor>
    </Render>
  );
};

export const MdxComponents = {
  pre: (props: any) => (
    <pre className="text-lg my-4">
      <code>{props.children}</code>
    </pre>
  ),
  h1: (props: any) => <HX {...props} tag="h2" />,
  h2: (props: any) => <HX {...props} tag="h2" />,
  h3: (props: any) => <HX {...props} tag="h3" />,
  h4: (props: any) => <HX {...props} tag="h4" />,
  h5: (props: any) => <HX {...props} tag="h5" />,
  h6: (props: any) => <HX {...props} tag="h6" />,
  Custom: (props: any) => <h1>CUSTOM</h1>,
};
