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

const Project = (project: Project) => (
    <li className="w-full">
        <Link
            href={project.link}
            className="rounded-lg p-5 flex group flex-col gap-4 dark:shadow-lg shadow-sm link:bg-slate-50 dark:link:bg-zinc-800 transition-colors duration-300"
        >
            <h2 className="text-base font-semibold leading-6 dark:text-white text-zinc-800">{project.name}</h2>
            <p className="duration-300 text-md font-display text-normal tracking-wide dark:text-slate-400 text-zinc-600 transition-colors">{project.description}</p>
            <p className="flex w-full flex-none text-sm items-center text-slate-400 group-hover:text-main transition-colors duration-300 gap-x-2">
                <span className="sr-only">Link</span>
                <Link2Icon className="h-4 w-4 text-current" aria-hidden="true" />
                <span>{new URL(project.link, "https://garcez.dev").host}</span>
            </p>
        </Link>
    </li>
);

const projects: Project[] = [
    {
        name: "Use Typed Reducer",
        link: "/projects/use-typed-reducer",
        host: "Test on my blog",
        language: "React + Typescript",
        description: "Fully typed way to control your local or global state",
    },
    {
        name: "Brouther",
        link: "https://brouther.vercel.app",
        host: "Website",
        language: "React + Typescript",
        description: "Your brother when you need to route your frontend.",
    },
    {
        name: "The Mask Input",
        link: "/projects/the-mask-input",
        host: "Test on my blog",
        language: "React + Typescript",
        description: "Component for inputs with masked values, works like <input />.",
    },
];

export default function ProjectsPage() {
    return (
        <div className="w-full container mt-12 mx-auto lg:w-3/4 px-4 md:px-0">
            <Head>
                <title>My projects</title>
            </Head>
            <header>
                <h1 className="text-4xl leading-relaxed tracking-wide font-bold">Projects</h1>
                <p className="opacity-80">A list my personal projects</p>
            </header>
            <ul className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {projects.map((project) => (
                    <Project {...project} key={`project-${project.name}`} />
                ))}
            </ul>
        </div>
    );
}
