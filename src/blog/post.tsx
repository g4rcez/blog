import marked from "marked";
import React, { useEffect, useState } from "react";
import { Body } from "../components/body";
import { useParams } from "react-router";
import { useSearch } from "../hooks/use-search";
import { Extension } from "./post.type";

type Params = Partial<{
  title: string;
}>;

type Search = Partial<{
  extension: Extension;
  language: string;
}>;

const heading = ["text-4xl", "text-2xl", "text-xl", "text-default"];

marked.use({
  renderer: {
    heading(text: string, level: number) {
      const className = heading[level - 1] ?? "text-default";
      return `
            <h${level} class="${className} font-bold">
              ${text}
            </h${level}>`;
    },
    list: (body: string, order: boolean) => {
      return `<${order ? "ol" : "ul"} class='py-4 pl-12 ${order ? "list-disc" : "list-decimal"}'>${body}</$>`;
    },
    listitem: (body: string) => `<li class='my-4 text-lg items-center text-left w-full list-disc'>${body}</li>`
  } as any
});

type GetFilePath = (x: { title: string; extension?: Extension; lang?: string }) => string;
const getFilePath: GetFilePath = (x) => {
  console.log({ x });
  const file = x.lang ?? "index";
  const ext = x.extension ?? Extension.Markdown;
  const path = `/posts/${x.title}`;
  return `${path}/${file}.${ext}`;
};

const Post = () => {
  const [content, setContent] = useState("");
  const params = useParams<Params>();
  const search = useSearch<Search>();
  useEffect(() => {
    const req = async () => {
      if (params.title) {
        const response = await fetch(getFilePath({ title: params.title, ...search }), {
          cache: "no-cache"
        });
        const text = await response.text();
        setContent(marked(text));
      }
    };
    req();
  }, [search, params.title]);
  return (
    <Body className="flex-col w-full">
      <div className="w-full flex flex-col m-auto px-3 md:p-0">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Body>
  );
};

export default Post;
