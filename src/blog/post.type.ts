import { Nullable } from "../react-app-env";

export enum Extension {
  Markdown = "md",
  Html = "html"
}
export type Commons = {
  description: Nullable<string>;
  extension: Extension;
  languages: string[];
  path: string;
  img: string;
  tags?: string[];
  post: string;
  readingTime: number;
};

export type JsonPost = Commons & {
  createdAt: string;
  hasTranslation: boolean;
  modifiedAt: number;
  path: string;
  languages: string[];
  description: string;
  extension: Extension;
  readingTime: number;
};

export type Post = Commons & {
  title: string;
  createdAt: Date;
  readingTime: number;
  modifiedAt: Date;
};
