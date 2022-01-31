import { randomUUID } from "crypto";
import { Db } from ".";

export namespace Tags {
  export const postType = {
    tutorial: "tutorial",
    idea: "idea",
    undefined: "undefined",
  };

  export type PostType = keyof typeof postType;

  export type AllTags = Awaited<ReturnType<typeof getAll>>;

  export const PostTypes = [postType.tutorial, postType.idea, postType.undefined];

  export const create = async (label: string) => Db.tags.create({ data: { label, tagId: randomUUID() } });

  export const update = async (id: string, label: string) => Db.tags.update({ data: { label }, where: { tagId: id } });

  export const getAll = async () => Db.tags.findMany({ orderBy: [{ label: "asc" }], select: { tagId: true, label: true } });
}
