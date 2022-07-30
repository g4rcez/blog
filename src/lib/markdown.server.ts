import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import gfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const markdown = async (markdown: string): Promise<string> => {
  try {
    const parsed = await unified()
      .use(gfm)
      .use(remarkBreaks)
      .use(remarkRehype)
      .use(remarkParse)
      .use(rehypeStringify)
      .process(markdown);
    return parsed.toString();
  } catch (error) {
    console.log("ERROR", error);
    return "";
  }
};
