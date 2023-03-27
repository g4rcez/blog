import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useMemo } from "react";
import { Format } from "../lib/format";
import { RxBookmark } from "react-icons/rx";
import { Posts } from "../lib/posts";
import { CMS } from "../lib/cms";
import Head from "next/head";
import { SEO } from "../lib/SEO";

export const getStaticProps = async () => {
  const posts = CMS.sort(Posts.all());
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
    <h2 className="text-4xl font-extrabold tracking-wide">{title}</h2>
  </header>
);

const StickyPosts = ({ posts }: Props) => {
  return (
    <aside className="lg:w-1/4 w-full hidden sm:flex">
      <div className="sticky top-20 z-50 isolate">
        <SectionTitle title="Recentes" />
        <section className="w-full gap-y-8 flex flex-wrap">
          {posts.slice(0, 3).map((x) => (
            <article key={x.id} className="w-full">
              <header className="transition-colors duration-500 cursor-pointer hover:underline">
                <Link
                  href={x.href}
                  className="inline-block w-full whitespace-pre-wrap"
                >
                  <h3 className="leading-relaxed inline-block">
                    <RxBookmark
                      aria-hidden="true"
                      className="text-primary-link inline-block mr-1"
                    />
                    {x.title}
                  </h3>
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
    <section className="w-full w-full lg:w-3/4">
      <SectionTitle
        title={
          <Fragment>
            {search === "" ? (
              ""
            ) : (
              <h2 className="text-primary-link">{search}</h2>
            )}
          </Fragment>
        }
      />
      <nav className="my-4 mb-8">
        <ul className="flex w-full flex-wrap gap-x-4 gap-y-6 text-xs text-white">
          {subjects.map((x) => (
            <li key={`subject-filter-${x}`}>
              <Link
                href={`/?subject=${x}`}
                className="rounded px-2 py-1 bg-main link:bg-primary-link transition-colors duration-300"
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
        {viewedPosts.map((x) => {
          const date = Format.date(x.date);
          return (
            <article key={x.id} className="flex flex-col w-full mb-8">
              <time dateTime={date} className="text-sm opacity-70">
                {date} - Tempo de leitura: {x.readingTime} min
              </time>
              <header className="transition-colors duration-500 cursor-pointer hover:underline mt-1 mb-2">
                <Link href={x.href}>
                  <h2 className="text-3xl font-extrabold tracking-wide">
                    {x.title}
                  </h2>
                </Link>
              </header>
              <p className="text-sm leading-relaxed dark:text-slate-300">
                {x.description}
              </p>
              <nav className="flex w-full gap-2 text-sm mt-2 opacity-70">
                {x.subjects.map((x) => (
                  <Link href={`/?subject=${x}`} className="link:underline">
                    #{x}
                  </Link>
                ))}
              </nav>
            </article>
          );
        })}
      </section>
    </section>
  );
};

export default function IndexPage({ posts, subjects }: Props) {
  return (
    <Fragment>
      <Head>
        <title key="title">Garcez Blog</title>
        <SEO.Index />
      </Head>
      <div className="w-full min-w-full flex-nowrap flex gap-x-8">
        <GroupedPosts posts={posts} subjects={subjects} />
        <StickyPosts posts={posts} subjects={[]} />
      </div>
    </Fragment>
  );
}
