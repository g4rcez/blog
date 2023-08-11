import Head from "next/head";
import { ProjectClient } from "~/components/project";
import { Track } from "~/components/track";
import { toMarkdown } from "~/lib/markdown";
import { Projects } from "~/lib/projects";
import "../../../styles/markdown.css";

const getProject = async (slug: string) => {
  const project = Projects.find(slug);
  return project === null
    ? null
    : { project, mdx: await toMarkdown(project.content) };
};

export default async function PostPage(props: any) {
  const content = await getProject(props.params.slug);
  if (!content) return <p>Not found</p>;
  const { project, mdx } = content;
  const openGraphImage = `https://garcez.dev/post-graph/${project.slug}.png`;

  return (
    <section className="block w-full min-w-full px-4 md:px-0">
      <Head>
        <meta name="description" content={project.description} />
        <meta name="keywords" content={project.keywords.join(",")} />
        <title>Garcez Projects | {project.title ?? ""}</title>
        <meta name="twitter:image:src" content={openGraphImage} />
        <meta name="twitter:site" content="@garcez.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="g4rcez/blog: O lugar do rascunho de ideias"
        />
        <meta name="twitter:description" content={project.description} />
        <meta property="og:image" content={openGraphImage} />
        <meta property="og:image:alt" content={project.description} />
        <meta property="og:image:width" content="1050" />
        <meta property="og:image:height" content="280" />
        <meta property="og:site_name" content="Blog do Garcez" />
        <meta property="og:type" content="object" />
        <meta
          property="og:title"
          content="g4rcez/blog: O lugar do rascunho de ideias"
        />
        <meta
          property="og:url"
          content={`https://garcez.dev/post/${project.slug}`}
        />
      </Head>
      <header className="mb-6 w-full container flex flex-col flex-wrap">
        <Track event="project" title={project.title} />
        <h1 className="mt-4 mb-2 font-extrabold whitespace-pre-wrap w-full text-4xl md:text-5xl flex flex-wrap">
          {project.title}
        </h1>
        <p className="mt-2 mb-2 text-sm">{project.description}</p>
      </header>
      <ProjectClient project={project} mdx={mdx} />
    </section>
  );
}
