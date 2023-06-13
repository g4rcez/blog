import gfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

export const toMarkdown = async (markdown: string) =>
  serialize(markdown, {
    parseFrontmatter: false,
    mdxOptions: {
      format: "mdx",
      remarkPlugins: [gfm],
    },
  });
