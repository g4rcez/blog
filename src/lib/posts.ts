import Path, { join } from "path";
import { z } from "zod";
import { toMarkdown } from "~/lib/markdown";
import { B } from "./brainiac";
import { CMS } from "./cms";
import { Format } from "./format";

export namespace Posts {
    export enum Language {
        ptBr = "pt-br",
        enUs = "en-us",
    }

    export enum Levels {
        Iniciante,
        Intermediario,
        Expert,
    }

    const schema = z
        .object({
            date: B.datetime,
            level: z.nativeEnum(Levels).optional().default(Levels.Iniciante),
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
        if (result.success) return result.data.map((x) => ({ ...x, content: "" })) as Post[];
        return [];
    };

    export type Post = z.infer<typeof schema>;

    export const find = (url: string): Post | null => {
        const result = CMS.find(Path.join(dir, url), schema);
        if (result.success) return result.data as Post;
        return null;
    };

    type AdjacentPosts = {
        next: Posts.Post | null;
        prev: Posts.Post | null;
    };

    export const content = async (slug: string) => {
        const post = Posts.find(slug);
        if (post === null) return null;
        const adjacentPosts = Posts.all().reduce<AdjacentPosts>(
            (acc, el, index, array) => {
                if (el.id === post.id) {
                    const next = array[index + 1] ?? null;
                    const prev = array[index - 1] ?? null;
                    return { next, prev };
                }
                return acc;
            },
            { next: null, prev: null }
        );
        return { post, adjacentPosts, mdx: await toMarkdown(post.content || "") };
    };
}
