import { bundleMDX } from "mdx-bundler";

export const compileMdx = async (content: string, language?: string) => {
  const result = await bundleMDX({
    source: content,
    xdmOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? [])];
      options.rehypePlugins = [...(options.rehypePlugins ?? [])];
      return options;
    },
  });
  return { code: result.code, content: content, post: result.frontmatter as never };
};
