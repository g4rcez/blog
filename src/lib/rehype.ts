import React from "react";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react/lib";
import { unified } from "unified";
import { MdxComponents } from "~/components/mdx-components";

export const rehype = async (text: string) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      Fragment: React.Fragment,
      components: MdxComponents,
      createElement: React.createElement as any,
    })
    .process(text);
