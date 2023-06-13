"use client";
import { Fragment, useRef } from "react";
import type { Posts } from "~/lib/posts";
import Link from "next/link";
import { Markdown } from "~/components/mdx";
import { useComment } from "~/lib/use-comment";
import { Toc, useTableOfContent } from "~/components/table-of-content";

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

export const TableOfContent = ({
  post,
  mdx,
}: {
  post: Posts.Post;
  mdx: any;
}) => {
  const [content, ref] = useTableOfContent();
  return (
    <Fragment>
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

  return <div className="w-full block min-w-full" ref={comment}></div>;
};
