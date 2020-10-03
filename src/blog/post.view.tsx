import Linq from "linq-arrays";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Body } from "../components/body";
import { Container } from "../components/container";
import { SubTitle } from "../components/typography";
import { useFormatLocaleDate } from "../global/settings.store";
import { useSearch } from "../hooks/use-search";
import { Markdown } from "../lib/markdown";
import POSTS from "../posts/posts.json";
import type { Post as PostType } from "./post.type";
import { Extension } from "./post.type";

type Params = Partial<{
  title: string;
}>;

type Search = Partial<{
  extension: Extension;
  language: string;
}>;

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
    const prevPost = curr - 1;
    const nextPost = curr + 1;
    return [POSTS[prevPost], POSTS[nextPost]];
  }, [post]);

  useLayoutEffect(() => {
    window.scrollTo({ behavior: "auto", top: 0 });
  }, [post]);

  useEffect(() => {
    const p = getPost(params.title!);
    setPost(p);
    document.title = `Garcez Blog - ${p.title}`;
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
        setContent(Markdown(text));
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
          <div className="div w-1/2">
            {prev && (
              <Link
                to={prev.url}
                className="hover:underline hover:text-primary-light leading-relaxed text-default text-info-light"
              >
                {"<- "}
                {prev.title}
              </Link>
            )}
          </div>
          <div className="div w-1/2 text-right">
            {next && (
              <Link
                to={next.url}
                className="hover:underline hover:text-primary-light leading-relaxed text-default text-info-light"
              >
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
