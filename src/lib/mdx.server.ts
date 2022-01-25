import { bundleMDX } from "mdx-bundler";
import fs from "fs/promises";
import { existsSync } from "fs";
import Path from "path";

export const compileMdx = async (post: string, language?: string): Promise<string | null> => {
  const filePath = Path.resolve(Path.join(process.cwd(), "_posts", `${post}.md`));
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
  return result.code;
};
