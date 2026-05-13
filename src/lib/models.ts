import { z } from "zod";

export const PostSchema = z.object({
    title: z.string(),
    description: z.string(),
    level: z.coerce.number(),
    subjects: z.array(z.string()),
    translations: z.array(z.string()),
    language: z.string(),
    date: z.string(),
    dateModified: z.string().optional(),
});

export type Post = {
    href: string;
    readingTime: number;
    date: string;
    info: {
        title: string;
        description: string;
        level: number;
        subjects: string[];
        date: string;
        dateModified?: string;
        translations: string[];
        language: string;
    };
};

export const wordCount = (content: string) => content.trim().split(/\s+/).filter(Boolean).length;

export const readingTime = (content: string) => Math.ceil(wordCount(content) / 250);

export const filterPosts = (q: string, posts: Post[]) =>
    q === ""
        ? posts
        : posts.filter((post) => {
              return post.info.title.toLowerCase().includes(q) || post.info.subjects.some((sub) => sub.includes(q));
          });
