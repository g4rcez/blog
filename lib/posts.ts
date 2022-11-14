import { join } from "path";
import { getAllSlugs, getFileByName } from "./markdown";

export type PostFile = {
  title: string;
  description?: string;
  date: string;
  image: string;
};
export type Post = PostFile & {
  slug: string;
  content: string;
  readingTime: number;
  subjects: string[];
};

export const postsDirectory = join(process.cwd(), "_posts");

export const getAllPosts = getAllSlugs(postsDirectory);

export const getPost = getFileByName<Post>(postsDirectory);

export const allPostInfo: (keyof Post)[] = [
  "title",
  "readingTime",
  "date",
  "slug",
  "description",
  "subjects",
  "content",
  "image",
];
