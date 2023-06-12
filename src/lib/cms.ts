import Path from "path";
import Fs from "fs";
import fs from "fs";
import matter from "gray-matter";
import { z } from "zod";

export namespace CMS {
  const parse = (filename: string, content: string) => {
    const md = matter(content);
    return {
      ...md.data,
      content: md.content,
      filename: Path.basename(filename).replace(/\.md$/, ""),
    };
  };

  const open = (path: string) => Fs.readFileSync(path, "utf-8");

  export const getAll = <T extends string, S extends {}>(
    dir: T,
    schema: z.ZodType<S>
  ) =>
    z
      .array(schema)
      .safeParse(
        Fs.readdirSync(dir).map((file) =>
          parse(file, open(Path.join(dir, file)))
        )
      );

  export const find = <T extends string, S extends {}>(
    dir: T,
    schema: z.ZodType<S>
  ) => {
    const file = open(Path.resolve(dir + ".md"));
    return schema.safeParse(parse(dir, file));
  };

  export const slugs = (dir: string): string[] =>
    fs
      .readdirSync(dir)
      .filter((x) => x.endsWith(".md"))
      .map((x) => x.replace(/\.md/g, ""));

  export const sort = <T extends Array<{ date: Date | string }>>(
    projects: T
  ): T =>
    [...projects].sort((post1, post2) =>
      new Date(post1.date) > new Date(post2.date) ? -1 : 1
    ) as any;
}
