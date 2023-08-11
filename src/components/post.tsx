"use client";
import Link from "next/link";
import React, { Fragment, useRef } from "react";
import { Markdown } from "~/components/mdx";
import { Toc, useTableOfContent } from "~/components/table-of-content";
import { Track } from "~/components/track";
import type { Posts } from "~/lib/posts";
import { Projects } from "~/lib/projects";
import { useComment } from "~/lib/use-comment";

export const WhoIsNext = (
  props: Posts.Post & { label: "next" | "prev"; className: string }
) => {
  const icon = props.label === "next" ? "->" : "<-";
  return (
    <Link
      href={props.href}
      className={
        "w-full hover:underline hover:text-primary-link cursor-pointer " +
        props.className
      }
    >
      {props.label === "prev" && <span className="mx-2">{icon}</span>}
      {props.title}
      {props.label === "next" && <span className="mx-2">{icon}</span>}
    </Link>
  );
};

export const MarkdownPost = ({
  post,
  mdx,
}: {
  post: Posts.Post | Projects.Project;
  mdx: any;
}) => {
  const [content, ref] = useTableOfContent();

  return (
    <Fragment>
      <Track event="post" title={post.title} />
      <nav className="table-of-content my-8">
        <Toc headers={content} />
      </nav>
      <section
        ref={ref}
        data-post={post.title}
        className="markdown block w-full min-w-full leading-relaxed antialiased tracking-wide break-words dark:text-slate-200"
      >
        <Markdown mdx={mdx} />
      </section>
    </Fragment>
  );
};

export const Comments = () => {
  const comment = useRef<HTMLDivElement | null>(null);
  useComment(comment);

  return (
    <div className="w-full min-w-full">
      <div className="w-full block min-w-full" ref={comment}></div>
    </div>
  );
};
