import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Format, toPost } from "../lib/format";
import { getAllMdFiles } from "../lib/markdown";
import { allPostInfo, getAllPosts, getPost, Post } from "../lib/posts";

export const getStaticProps = async () => {
  const posts = getAllMdFiles<Post>(
    allPostInfo.filter((x) => x !== "content"),
    getAllPosts,
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
  const id = useRef(() => Math.random().toString(36).substring(2, 16)).current;

  const list = useMemo(
    () => [...(subjects ?? [])].sort((a, b) => a.localeCompare(b)),
    [subjects]
  );

  return (
    <ul className="inline-flex gap-4 mt-2 text-md flex-wrap">
      {list.map((y) => (
        <li key={`${y}-${id}`}>
          <button
            onClick={() => onClick(y)}
            className={`${
              y === search
                ? "bg-primary-dark link:bg-primary-light px-2 text-white rounded"
                : "underline underline-offset-4 decoration-primary-dark link:decoration-2"
            } duration-300 transition-colors`}
          >
            {y}
          </button>
        </li>
      ))}
      {root && (
        <li>
          <button
            onClick={() => onClick("")}
            className="text-orange-600 link:text-orange-500 duration-500 transition-colors"
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

  const change = useCallback(async (text: string) => {
    setSearch(text);
    await push({ query: { subject: text || undefined } });
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
