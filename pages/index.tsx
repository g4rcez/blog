import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useMemo } from "react";
import { Format, toPost } from "../lib/format";
import { getAllMdFiles } from "../lib/markdown";
import { allPostInfo, getAllPosts, getPost, Post } from "../lib/posts";
import { RxBookmark } from "react-icons/rx";

export const getStaticProps = async () => {
  const posts = getAllMdFiles<Post>(
    allPostInfo.filter((x) => x !== "content"),
    getAllPosts,
    getPost
  );
  return {
    props: {
      posts,
      subjects: [...new Set(posts.flatMap((post) => post.subjects))],
    },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SectionTitle = ({ title }: { title: string | React.ReactElement }) => (
  <header className="w-full min-w-full mb-6">
    <h2 className="text-4xl font-semibold">{title}</h2>
  </header>
);

const StickyPosts = ({ posts }: Props) => {
  return (
    <aside className="lg:w-1/4 w-full order-0 sm:order-1">
      <div className="sticky top-20 z-50 isolate">
        <SectionTitle title="Recentes" />
        <section className="w-full gap-y-8 flex flex-wrap">
          {posts.slice(0, 3).map((x) => (
            <article key={x.slug} className="flex flex-col w-full">
              <header className="transition-colors duration-500 cursor-pointer hover:underline">
                <Link
                  href={toPost(x.slug)}
                  className="flex gap-2 items-baseline"
                >
                  <RxBookmark
                    aria-hidden="true"
                    className="text-primary-link mt-1"
                  />
                  <h3 className="leading-relaxed">{x.title}</h3>
                </Link>
              </header>
            </article>
          ))}
        </section>
      </div>
    </aside>
  );
};

const useSearch = () => {
  const router = useRouter();
  const params = new URLSearchParams(router.asPath.split("?")[1] ?? "");
  return params.get("subject") ?? "";
};

const GroupedPosts = ({ posts, subjects }: Props) => {
  const search = useSearch();

  const viewedPosts = useMemo(
    () =>
      search === ""
        ? posts
        : posts.filter((post) => {
            const lowerSearch = search.toLowerCase();
            if (post.title.toLowerCase().includes(lowerSearch)) return true;
            if (post?.description?.toLowerCase().includes(lowerSearch))
              return true;
            return (post?.subjects ?? []).some((x) =>
              x.toLowerCase().includes(lowerSearch)
            );
          }),
    [posts, search]
  );

  return (
    <div className="w-full w-full lg:w-3/4">
      <SectionTitle
        title={
          <Fragment>
            Todos os posts
            {search === "" ? (
              ""
            ) : (
              <Fragment>
                {" - "} <span className="text-primary-link">{search}</span>
              </Fragment>
            )}
          </Fragment>
        }
      />
      <nav className="my-4 mb-8">
        <ul className="flex gap-x-4 text-xs text-white">
          {subjects.map((x) => (
            <li key={`subject-filter-${x}`}>
              <Link
                href={`/?subject=${x}`}
                className="capitalize rounded px-2 py-1 bg-main link:bg-primary-link transition-colors duration-300"
              >
                {x}
              </Link>
            </li>
          ))}
          <Link href="/" className="underline text-on-base">
            Limpar
          </Link>
        </ul>
      </nav>
      <section className="w-full gap-y-12">
        {viewedPosts.map((x) => (
          <article key={x.slug} className="flex flex-col w-full mb-8">
            <header className="transition-colors duration-500 cursor-pointer hover:underline">
              <Link href={toPost(x.slug)}>
                <h3 className="text-2xl">{x.title}</h3>
              </Link>
            </header>
            <p className="text-sm opacity-50 my-2">
              {Format.date(x.date)} - {x.readingTime} min read
            </p>
            <p className="text-sm leading-relaxed dark:text-slate-300">
              {x.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default function IndexPage({ posts, subjects }: Props) {
  return (
    <div className="w-full min-w-full flex gap-x-8">
      <GroupedPosts posts={posts} subjects={subjects} />
      <StickyPosts posts={posts} subjects={[]} />
    </div>
  );
}
