export enum Extension {
  Markdown = "md",
  Html = "html"
}
export type Post = {
  img: string;
  headerInit: number;
  headerEnd: number;
  readingTime: number;
  useFolks: boolean;
  subjects: string[];
  title: string;
  language: string;
  translations: string[];
  description: string;
  createdAt: string;
  path: string;
  url: string;
};

type GetFilePath = (x: { title: string; extension?: Extension; lang?: string }) => string;
export const getFilePath: GetFilePath = (x) => {
  const file = x.lang ?? "index";
  const ext = x.extension ?? Extension.Markdown;
  const path = `/posts/${x.title}`;
  return `${path}/${file}.${ext}`;
};
