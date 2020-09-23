import { isEmpty } from "ramda";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/container";
import { Img } from "../components/img";
import { Input } from "../components/input";
import { Tag } from "../components/tag";
import { Paragraph, SubTitle } from "../components/typography";
import { useFormatLocaleDate } from "../global/settings.store";
import { Strings } from "../lib/strings";
import POSTS from "../posts/posts.json";
import { Links } from "../routes/links";
import { Extension, JsonPost, Post } from "./post.type";

const getPosts = (): Post[] =>
  (POSTS as any[]).map(
    (x: JsonPost): Post => ({
      img: x.img,
      post: x.path,
      extension: x.extension as Extension,
      path: Links.getPost(x.path, x.extension, undefined),
      readingTime: x.readingTime,
      title: Strings.capitalize(x.path),
      createdAt: new Date(x.createdAt),
      modifiedAt: new Date(x.modifiedAt),
      description: x.description ?? null,
      languages: x.languages ?? null,
      tags: x.tags
    })
  );

type Props = {
  posts?: number;
};

const Posts = (props: Props) => {
  const dateFormat = useFormatLocaleDate();
  const [filter, setFilter] = useState("");

  const posts = useMemo(() => {
    const p = getPosts();
    return filter === ""
      ? p
      : p.filter((item) => (item.tags ?? []).some((tag) => tag.toLowerCase().includes(filter.toLowerCase())));
  }, [filter]);

  const tags = useMemo(
    () => [
      ...getPosts()
        .reduce((acc, el) => {
          (el.tags ?? []).forEach((x) => acc.add(x));
          return acc;
        }, new Set<string>())
        .values()
    ],
    []
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value);

  const clearFilter = () => setFilter("");

  return (
    <div className="flex flex-wrap flex-col md:flex-row justify-items-end w-full">
      <Container className="w-full h-fit">
        <SubTitle size="text-4xl" className="mb-8 font-bold w-full flex">
          Posts
        </SubTitle>
      </Container>
      <div className="w-full md:w-3/4 flex md:flex-col flex-col order-2 md:order-1">
        {posts.slice(0, props.posts).map((post) => (
          <Container key={post.path} className="flex flex-auto items-center mb-8 justify-between">
            <Img
              src={post.img}
              alt={post.title}
              className="img-responsive w-16 h-w-16 rounded-full bg-primary p-2 flex"
            />
            <div className="flex flex-auto flex-col ml-4">
              <SubTitle size="text-3xl" className="font-bold">
                {post.title}
              </SubTitle>
              {!isEmpty(post.languages) && (
                <Paragraph>
                  {post.languages.map((lang) => (
                    <Link to={Links.getPost(post.post, post.extension, lang)}>{lang}</Link>
                  ))}
                </Paragraph>
              )}
              <SubTitle tag="h3" size="text-sm">
                {dateFormat(post.createdAt)} - Reading time: <b>{post.readingTime} min</b>
              </SubTitle>
              <Paragraph>{post.description}</Paragraph>
              <div className="inline-block">
                {!isEmpty(post.tags) && post.tags!.map((lang) => <Tag onClick={() => setFilter(lang)}>#{lang}</Tag>)}
              </div>
            </div>
          </Container>
        ))}
      </div>
      <div className="w-full md:w-1/4 flex flex-col order-1 md:order-2 p-4 md:p-0">
        <Input
          containerClassName="w-full"
          placeholder="Find your post"
          name="posts"
          onChange={onChange}
          rightIcons={
            <span
              onClick={clearFilter}
              className="items-center cursor-pointer text-base text-2xl -mt-2 hover:text-primary-light text-animate"
            >
              &times;
            </span>
          }
          value={filter}
        />
        <Container className="mt-2">
          {tags.map((x) => (
            <Tag onClick={() => setFilter(x)}>#{x}</Tag>
          ))}
        </Container>
      </div>
    </div>
  );
};

export default Posts;
