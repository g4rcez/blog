import { existsSync } from "fs";
import fs from "fs/promises";
import { bundleMDX } from "mdx-bundler";
import Path from "path";

export const compileMdx = async (post: string, language?: string) => {
  const filePath = Path.resolve(Path.join(__dirname, "_posts", `${post}.md`));
  if (!existsSync(filePath)) {
    return null;
  }
  const mdxSource = await fs.readFile(filePath, "utf-8");
  const result = await bundleMDX({
    source: mdxSource,
    xdmOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? [])];
      options.rehypePlugins = [...(options.rehypePlugins ?? [])];
      return options;
    },
  });
  return { code: result.code, content: mdxSource, post: result.frontmatter as never };
};
