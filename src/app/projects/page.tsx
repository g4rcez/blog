import { Link2Icon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";

type Project = {
  name: string;
  link: string;
  description: string;
  host: string;
  language: string;
};

function Project(project: Project) {
  return (
    <li className="w-full">
      <h2 className="sr-only">{project.name}</h2>
      <div className="rounded-lg shadow-sm dark:border-zinc-600 border-slate-200 border">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6">Name</dt>
            <dd className="mt-1 text-base font-semibold leading-6 dark:text-white text-zinc-800">
              {project.name}
            </dd>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dt className="sr-only"></dt>
            <dd className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-green-600/20">
              {project.language}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Link</span>
              <Link2Icon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              <Link href={project.link}>{project.host}</Link>
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t dark:border-zinc-700 border-slate-100 px-6 py-6">
          <span className="text-sm font-semibold leading-6 text-gray-900">
            {project.description}
          </span>
        </div>
      </div>
    </li>
  );
}

const projects: Project[] = [
  {
    name: "The Mask Input",
    link: "/projects/the-mask-input",
    host: "Test on my blog",
    language: "React + Typescript",
    description: "Mask component for your <input/>",
  },
  {
    name: "Brouther",
    link: "https://brouther.vercel.app",
    host: "Website",
    language: "React + Typescript",
    description: "The brother router to help in React apps",
  },
];

export default function ProjectsPage() {
  return (
    <div className="w-full container mt-12 mx-auto lg:w-3/4">
      <Head>
        <title>My projects</title>
      </Head>
      <header>
        <h1 className="text-4xl leading-relaxed tracking-wide font-bold">
          Projects
        </h1>
        <p className="opacity-80">A list my personal projects</p>
      </header>
      <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <Project {...project} key={`project-${project.name}`} />
        ))}
      </ul>
    </div>
  );
}
