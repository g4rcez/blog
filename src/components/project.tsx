"use client";
import React from "react";
import { Projects } from "~/lib/projects";
import { MarkdownPost } from "~/components/post";

export const ProjectClient = ({
  project,
  mdx,
}: {
  project: Projects.Project;
  mdx: any;
}) => <MarkdownPost post={project} mdx={mdx} />;
