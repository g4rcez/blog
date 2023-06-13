"use client";
import React from "react";
import { Projects } from "~/lib/projects";
import { TableOfContent } from "~/components/post";

export const ProjectClient = ({
  project,
  mdx,
}: {
  project: Projects.Project;
  mdx: any;
}) => <TableOfContent post={project} mdx={mdx} />;
