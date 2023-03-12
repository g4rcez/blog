import Path, { join } from "path";
import { z } from "zod";
import { B } from "./brainiac";
import { CMS } from "./cms";

export namespace Projects {
  const schema = z
    .object({
      date: B.datetime,
      title: B.notEmptyString,
      slug: B.notEmptyString,
      npmName: B.notEmptyString,
      npmLink: z.string().url(),
      description: B.notEmptyString,
      keywords: z.array(B.notEmptyString),
      content: B.notEmptyString.optional().default(""),
    })
    .transform((x) => ({ ...x, date: new Date(x.date).toISOString() }));

  const dir = join(process.cwd(), "_projects");

  export const slugs = (): string[] => CMS.slugs(dir);

  export type Project = z.infer<typeof schema>;

  export const find = (url: string): Project | null => {
    const result = CMS.find(Path.join(dir, url), schema);
    if (result.success) return result.data as Project;
    return null;
  };
}
