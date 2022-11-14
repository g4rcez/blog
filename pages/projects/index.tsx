import Link from "next/link";

type Project = {
  name: string;
  link: string;
  description: string;
};

const projects: Project[] = [
  {
    name: "The Mask Input",
    link: "/projects/the-mask-input",
    description: "Mask component for your <input/>",
  },
];

export default function ProjectsPage() {
  return (
    <div className="w-full h-full">
      <header>
        <h1 className="text-4xl leading-relaxed tracking-wide font-bold">
          Projects
        </h1>
        <p className="opacity-80">A list my personal projects</p>
      </header>
      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.name}>
            <Link
              href={project.link}
              className="p-8 border dark:border-slate-600 border-slate-300 text-slate-600 dark:text-slate-200 link:border-primary-link dark:link:border-primary-light duration-500 transition-colors link:text-primary-link dark:link:text-primary-light border-white rounded-lg block"
            >
              <h2 className="text-3xl leading-relaxed tracking-wide font-medium">
                {project.name}
              </h2>
              <p className="opacity-70">{project.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
