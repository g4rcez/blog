import Path, { join } from "path";
import { z } from "zod";
import { B } from "./brainiac";
import { Format } from "./format";
import { CMS } from "./cms";

export namespace Posts {
  export enum Language {
    ptBr = "pt-br",
    enUs = "en-us",
  }

  const schema = z
    .object({
      date: B.datetime,
      title: B.notEmptyString,
      filename: B.notEmptyString,
      description: B.notEmptyString,
      language: z.nativeEnum(Language),
      subjects: z.array(B.notEmptyString),
      content: B.notEmptyString.optional().default(""),
      translations: z.array(z.nativeEnum(Language)).optional().default([]),
    })
    .transform((x) => {
      const slug = Format.slug(x.filename);
      return {
        ...x,
        id: slug,
        href: Format.toPost(slug),
        readingTime: Format.readingTime(x.content),
      };
    });

  const dir = join(process.cwd(), "_posts");

  export const slugs = (): string[] => CMS.slugs(dir);

  export const all = (): Post[] => {
    const result = CMS.getAll(dir, schema);
    if (result.success) return result.data as Post[];
    return [];
  };

  export type Post = z.infer<typeof schema>;

  export const find = (url: string): Post | null => {
    const result = CMS.find(Path.join(dir, url), schema);
    if (result.success) return result.data as Post;
    return null;
  };
}
