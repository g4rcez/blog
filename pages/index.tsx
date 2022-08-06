import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Format, toPost } from "../lib/format";
import { getAllPosts } from "../lib/markdown";

export const getStaticProps = async () => {
  const posts = getAllPosts([
    "slug",
    "date",
    "subjects",
    "readingTime",
    "description",
    "title",
    "image",
  ]);
  const subjects = [...new Set(posts.flatMap((post) => post.subjects))];
  return { props: { posts, subjects } };
};

const Subjects = ({
  subjects,
  onClick,
  search,
}: {
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
    <div className="prose flex gap-x-2 xl:prose-md mt-2 text-md flex-wrap gap-y-2">
      {list.map((y) => (
        <button
          onClick={() => click(y)}
          className={`${
            y === search
              ? "bg-primary-link focus:bg-primary-link"
              : "bg-primary-dark focus:bg-primary-dark"
          } hover:bg-primary duration-500 transition-colors px-2 rounded text-primary-contrast`}
          key={`${y}-${id}`}
        >
          {y}
        </button>
      ))}
    </div>
  );
};

export default function Index({
  posts,
  subjects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState("");

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
          <Subjects subjects={subjects} search={search} onClick={setSearch} />
        </div>
      </header>
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-12">
        {viewedPosts.map((x) => (
          <article key={x.slug} className="flex flex-col w-full">
            <header className="text-primary-link transition-colors duration-500 cursor-pointer hover:underline">
              <Link href={toPost(x.slug)}>
                <a href={toPost(x.slug)}>
                  <h3 className="text-2xl font-bold">{x.title}</h3>
                </a>
              </Link>
            </header>
            <p className="prose xl:prose-lg text-sm opacity-50 my-2">
              {Format.date(x.date)} - {x.readingTime} min read
            </p>
            <p className="prose xl:prose-lg text-md">{x.description}</p>
            <Subjects
              subjects={x.subjects}
              search={search}
              onClick={setSearch}
            />
          </article>
        ))}
      </section>
    </div>
  );
}
