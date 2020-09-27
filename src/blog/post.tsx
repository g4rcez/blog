import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "../components/tag";
import { Paragraph, SubTitle } from "../components/typography";
import { Post as PostType } from "./post.type";

export const Post = ({
  post,
  setFilter,
  dateFormat
}: {
  post: PostType;
  dateFormat: (date: string) => string;
  setFilter?: (tag: string) => void;
}) => (
  <div key={post.path} className="flex flex-auto items-center mb-8 justify-between">
    <div className="flex flex-auto flex-col">
      <Link className="w-fit" to={post.url}>
        <SubTitle size="text-3xl" className="font-bold hover:underline hover:text-info-light">
          {post.title}
        </SubTitle>
      </Link>
      <SubTitle tag="h3" size="text-sm">
        {dateFormat(post.createdAt as any)} - Reading time: <b>{post.readingTime} min</b>
      </SubTitle>
      <Paragraph>{post.description}</Paragraph>
      <div className="inline-flex flex-wrap">
        {(post.subjects ?? []).map((tag) => (
          <Tag key={`${post.path}-${tag}`} onClick={() => setFilter?.(tag)}>
            #{tag}
          </Tag>
        ))}
      </div>
    </div>
  </div>
);
