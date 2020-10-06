import React, { useMemo, useState } from "react";
import { Body } from "../components/body";
import { Container } from "../components/container";
import { Input } from "../components/input";
import { Tag } from "../components/tag";
import { SubTitle } from "../components/typography";
import { useFormatLocaleDate } from "../global/settings.store";
import { Strings } from "../lib/strings";
import POSTS from "../posts/posts.json";
import { Post } from "./post";

type Props = {
  posts?: number;
};

const PostsView = (props: Props) => {
  const dateFormat = useFormatLocaleDate();
  const [filter, setFilter] = useState("");

  const posts = useMemo(
    () =>
      filter === ""
        ? POSTS
        : POSTS.filter((item) => (item.subjects ?? []).some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))),
    [filter]
  );

  const tags = useMemo(
    () => [
      ...POSTS.reduce((acc, el) => {
        (el.subjects ?? []).forEach((x) => acc.add(x));
        return acc;
      }, new Set<string>()).values()
    ].sort(Strings.sort),
    []
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value);

  const clearFilter = () => setFilter("");

  return (
    <Body className="flex-col w-full">
      <div className="justify-center w-full flex flex-col items-center m-auto">
        <div className="flex flex-wrap flex-col md:flex-row justify-items-end w-full px-2 md:px-0">
          <Container className="w-full h-fit">
            <SubTitle size="text-4xl" className="mb-8 font-bold w-full flex">
              Posts
            </SubTitle>
          </Container>
          <div className="w-full md:w-3/4 flex md:flex-col flex-col order-2 md:order-1">
            {posts.slice(0, props.posts).map((post) => (
              <Post key={post.url} dateFormat={dateFormat} post={post} setFilter={setFilter} />
            ))}
          </div>
          <div className="w-full md:w-1/4 flex flex-col order-1 md:order-2">
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
            <Container className="mt-2 mb-4">
              {tags.map((x) => (
                <Tag key={`${x}`} onClick={() => setFilter(x)}>
                  #{x}
                </Tag>
              ))}
            </Container>
          </div>
        </div>
      </div>
    </Body>
  );
};

export default PostsView;
