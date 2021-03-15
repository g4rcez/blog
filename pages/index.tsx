import { GetStaticProps } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Format } from "../lib/format";
import { getAllPosts, Post } from "../lib/markdown";

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts([
    "slug",
    "date",
    "readingTime",
    "description",
    "title",
    "image",
  ]);
  return { props: { posts }, revalidate: false };
};

const toPost = (slug: string) => `/post/${slug}`;

export default function Index({ posts }: { posts: Post[] }) {
  return (
    <Fragment>
      <div
        className="w-full flex flex-wrap flex-col gap-y-8 justify-center items-center"
        key="all-my-posts"
      >
        {posts.map((x) => {
          return (
            <section key={x.slug} className="w-full">
              <nav>
                <header className="text-primary-link transition-colors duration-500 cursor-pointer hover:underline">
                  <Link href={toPost(x.slug)}>
                    <h3 className="text-2xl font-bold">{x.title}</h3>
                  </Link>
                </header>
              </nav>
              <p className="prose xl:prose-lg text-sm opacity-50 my-2">
                {Format.date(x.date)} - {x.readingTime} min read
              </p>
              <p className="prose xl:prose-lg text-md">{x.description}</p>
            </section>
          );
        })}
      </div>
    </Fragment>
  );
}
