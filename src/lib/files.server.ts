import Path from "path";
import frontMatter from "front-matter";
import Fs from "fs";
import { postsDirectory } from "~/post";

export namespace Files {
  export type PostFile = {
    useFolks: boolean;
    subjects: string[];
    title: string;
    language: string;
    translations: string[];
    slug: string;
    date: Date;
    description: string;
    readingTime: number;
  };

  export const parsePostFile = (postFile: any, slug: string, content: string) => ({
    ...postFile,
    date: new Date(postFile.date),
    slug: Path.basename(slug, ".md"),
    readingTime: Math.ceil(content.split(" ").length / 250),
  });

  export const listAllPosts = async (): Promise<PostFile[]> => {
    const base = Path.resolve(postsDirectory);
    const posts = Fs.readdirSync(base, "utf-8");
    const files = await Promise.all(
      posts.map(async (post): Promise<PostFile> => {
        const content = Fs.readFileSync(Path.join(base, post), "utf-8");
        const postFile = frontMatter(content).attributes as any;
        return { ...postFile, date: new Date(postFile.date), slug: Path.basename(post, ".md") };
      })
    );
    return files.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
}
