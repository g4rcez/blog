import React from "react";
import { Post } from "./post.type";
import { SubTitle } from "../components/typography";

type Props = {
  post: Post;
  align?: "text-right" | "text-left";
};
export const PostTag = ({ post, align = "text-left" }: Props) => {
  return (
    <div className={align}>
      <SubTitle>{post.title}</SubTitle>
    </div>
  );
};
