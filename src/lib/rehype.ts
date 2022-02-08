import React from "react";
import { MdxComponents } from "~/components/mdx-components";

export const rehype = async (text: string) => {
  const { unified } = await import("unified");
  const rehypeParse = await import("rehype-parse");
  const rehypeReact = await import("rehype-react");
  return unified()
    .use(rehypeParse.default, { fragment: true })
    .use(rehypeReact.default, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      components: MdxComponents,
    })
    .process(text);
};
