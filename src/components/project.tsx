"use client";
import { Fragment } from "react";
import { useTableOfContent } from "~/components/table-of-content";
import { Markdown } from "~/components/mdx";
import { Projects } from "~/lib/projects";

export const ProjectClient = ({
  project,
  mdx,
}: {
  project: Projects.Project;
  mdx: any;
}) => {
  const [Content, ref] = useTableOfContent();
  return (
    <Fragment>
      <nav className="table-of-content mb-8">
        <Fragment>
          <h2 className="text-xl font-bold mb-2">Table of Content</h2>
          {Content.toc && <Content.toc />}
        </Fragment>
      </nav>
      <section
        ref={ref}
        data-post={project.title}
        className="markdown block w-full min-w-full leading-relaxed antialiased tracking-wide break-words dark:text-slate-200"
      >
        <Markdown mdx={mdx} />
      </section>
    </Fragment>
  );
};
