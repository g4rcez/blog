import Linq from "linq-arrays";
import marked from "marked";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Body } from "../components/body";
import { Container } from "../components/container";
import { SubTitle } from "../components/typography";
import { useFormatLocaleDate } from "../global/settings.store";
import { useSearch } from "../hooks/use-search";
import POSTS from "../posts/posts.json";
import type { Post as PostType } from "./post.type";
import { Extension } from "./post.type";
import "./code.css";
import "./prism";

type Params = Partial<{
  title: string;
}>;

type Search = Partial<{
  extension: Extension;
  language: string;
}>;

const heading = ["text-5xl", "text-3xl", "text-2xl", "text-lg"];
marked.setOptions({
  highlight: (code, language) => {
    try {
      const prism = (window as any).Prism;
      const lang = language in prism.languages ? language : "typescript";
      return prism.highlight(code, prism.languages[lang], language);
    } catch (error) {
      return code;
    }
  }
});
marked.use({
  gfm: true,
  xhtml: true,
  smartypants: true,
  smartLists: true,
  renderer: {
    listitem: (body: string) => `<li class='my-4 text-lg inline-block items-center text-left w-full'>${body}</li>`,
    paragraph: (text: string) =>
      `<p class="mb-4 whitespace-pre-line font-normal leading-relaxed break-words text-lg">${text}</p>`,
    heading(text: string, level: number) {
      const className = heading[level - 1] ?? "text-default";
      return `
            <h${level} class="${className} font-bold my-8">
              ${text}
            </h${level}>`;
    },
    blockquote: (body: string) =>
      `<blockquote class="p-2 ml-3 pl-3 border-l-4 py-4 border-info-light my-8 italic font-thin text-lg">${body}</blockquote>`,
    list: (body: string, order: boolean) =>
      `<${order ? "ol" : "ul"} class='list-inside ${order ? "list-disc" : "list-decimal"}'>${body}</$>`
  } as any
});

type GetFilePath = (x: { title: string; extension?: Extension; lang?: string }) => string;
const getFilePath: GetFilePath = (x) => {
  const file = x.lang ?? "index";
  const ext = x.extension ?? Extension.Markdown;
  const path = `/posts/${x.title}`;
  return `${path}/${file}.${ext}`;
};

const getPost = (title: string): PostType => Linq.WhereFirst(POSTS, "path", "===", title) as never;

const PostView = () => {
  const [content, setContent] = useState("");
  const params = useParams<Params>();
  const search = useSearch<Search>();
  const [post, setPost] = useState<PostType>(() => getPost(params.title!) as any);
  const dateFormat = useFormatLocaleDate();

  const [prev, next] = useMemo((): [PostType | undefined, PostType | undefined] => {
    const curr = POSTS.findIndex((x) => x.path === post.path);
    const prevPost = Math.max(0, curr - 1);
    const nextPost = Math.max(POSTS.length - 1, curr + 1);
    return [POSTS[prevPost], POSTS[nextPost]];
  }, [post]);

  useLayoutEffect(() => {
    window.scrollTo({ behavior: "auto", top: 0 });
  }, [post]);

  useEffect(() => {
    setPost(getPost(params.title!));
  }, [params.title]);

  useEffect(() => {
    const req = async () => {
      if (params.title) {
        const response = await fetch(getFilePath({ title: params.title, ...search }), {
          cache: "no-cache"
        });
        let text = await response.text();
        text = text.replace(/---.*\n/gi, "");
        for (let index = 0; index < post.headerEnd - 1; index++) {
          text = text.replace(/^[a-zA-Z0-9]+: ?.*\n/gi, "");
        }
        setContent(marked(text));
      }
    };
    req();
  }, [search, post.headerEnd, params.title]);

  return (
    <Body className="flex-col w-full">
      <div className="w-full flex flex-col m-auto md:p-0 md:max-w-4xl">
        <SubTitle tag="h1" size="text-4xl" className="font-bold mb-4">
          {post.title}
        </SubTitle>
        {post.createdAt && (
          <SubTitle tag="h3" size="text-sm" className="mb-8">
            {dateFormat(post.createdAt)} - Reading time: <b>{post.readingTime} min</b>
          </SubTitle>
        )}
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <Container className="justify-between">
          <div className="div w-full md:w-1/2">
            {prev && (
              <Link to={prev.url} className="hover:underline hover:text-primary-light leading-relaxed text-lg">
                {"<- "}
                {prev.title}
              </Link>
            )}
          </div>
          <div className="div w-full md:w-1/2 text-right">
            {next && (
              <Link to={next.url} className="hover:underline hover:text-primary-light leading-relaxed text-lg">
                {next.title} {" ->"}
              </Link>
            )}
          </div>
        </Container>
      </div>
    </Body>
  );
};

export default PostView;
