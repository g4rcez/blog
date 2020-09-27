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
