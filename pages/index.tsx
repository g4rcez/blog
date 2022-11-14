import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { Format, toPost } from "../lib/format";
import { getAllMdFiles } from "../lib/markdown";
import { getPost, getPostSlugs, Post } from "../lib/posts";

export const getStaticProps = async () => {
  const posts = getAllMdFiles<Post>(
    [
      "slug",
      "date",
      "subjects",
      "readingTime",
      "description",
      "title",
      "image",
    ],
    getPostSlugs,
    getPost
  );
  const subjects = [...new Set(posts.flatMap((post) => post.subjects))];
  return { props: { posts, subjects } };
};

const Subjects = ({
  subjects,
  onClick,
  search,
  root = false,
}: {
  root?: boolean;
  subjects?: string[];
  search: string;
  onClick: (str: string) => void;
}) => {
  const id = useMemo(() => Math.random().toString(36).substr(2, 16), []);

  const list = useMemo(
    () => [...(subjects ?? [])].sort((a, b) => a.localeCompare(b)),
    [subjects]
  );

  const click = useCallback((x: string) => {
    onClick(x);
  }, []);

  return (
    <ul className="inline-flex gap-2 mt-2 text-md flex-wrap">
      {list.map((y) => (
        <li key={`${y}-${id}`}>
          <button
            onClick={() => click(y)}
            className={`${
              y === search
                ? "bg-primary-link link:bg-primary-link"
                : "bg-primary-dark link:bg-primary-dark"
            } duration-500 transition-colors px-2 rounded text-primary-contrast`}
          >
            {y}
          </button>
        </li>
      ))}
      {root && (
        <li>
          <button
            onClick={() => click("")}
            className={`bg-orange-500 link:bg-orange-300 duration-500 transition-colors px-2 rounded text-primary-contrast`}
          >
            Clear
          </button>
        </li>
      )}
    </ul>
  );
};

export default function IndexPage({
  posts,
  subjects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState("");
  const { push } = useRouter();

  const change = useCallback((text: string) => {
    setSearch(text);
    push({ query: { subject: text || undefined } });
  }, []);

  const viewedPosts = useMemo(
    () =>
      search === ""
        ? posts
        : posts.filter((post) => {
            const lowerSearch = search.toLowerCase();
            if (post.title.toLowerCase().includes(lowerSearch)) {
              return true;
            }
            if (post?.description?.toLowerCase().includes(lowerSearch)) {
              return true;
            }
            return (post?.subjects ?? []).some((x) =>
              x.toLowerCase().includes(lowerSearch)
            );
          }),
    [posts, search]
  );

  return (
    <div className="w-full min-w-full">
      <header>
        <p className="mb-1 font-semibold">Busque por assuntos</p>
        <div className="flex flex-row flex-wrap gap-2 mb-8">
          <Subjects root subjects={subjects} search={search} onClick={change} />
        </div>
      </header>
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-12">
        {viewedPosts.map((x) => (
          <article key={x.slug} className="flex flex-col w-full">
            <header className="text-primary-link transition-colors duration-500 cursor-pointer hover:underline">
              <Link href={toPost(x.slug)}>
                <h3 className="text-2xl font-bold">{x.title}</h3>
              </Link>
            </header>
            <p className="text-sm opacity-50 my-2">
              {Format.date(x.date)} - {x.readingTime} min read
            </p>
            <p className="text-md leading-relaxed dark:text-slate-300">
              {x.description}
            </p>
            <Subjects search={search} onClick={change} subjects={x.subjects} />
          </article>
        ))}
      </section>
    </div>
  );
}
