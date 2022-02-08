export const markdown = async (markdown: string): Promise<string> => {
  const { unified } = await import("unified");
  const remarkParse = await import("remark-parse");
  const remarkRehype = await import("remark-rehype");
  const rehypeDocument = await import("rehype-document");
  const rehypeStringify = await import("rehype-stringify");
  const gfm = await import("remark-gfm");
  const remarkBreaks = await import("remark-breaks");

  const parsed = await unified()
    .use(gfm.default)
    .use(remarkBreaks.default)
    .use(remarkRehype.default)
    .use(remarkParse.default)
    .use(rehypeStringify.default)
    .use(rehypeDocument.default, { meta: [], responsive: true })
    .process(markdown);
  return parsed.toString();
};
