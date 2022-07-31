import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Topic } from "../components/topic";
import { Notion } from "../lib/notion";
type Props = {
  posts: Notion.Post;
};
export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { posts: await Notion.getPosts() },
  revalidate: 3600,
});

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="container mx-auto w-full">
      <h2 className="text-6xl font-black leading-loose antialiased">My Blog</h2>
      {props.posts.map((post) => (
        <section key={`${post.id}-postId`} className="text-slate-100">
          <header>
            <h2 className="text-3xl font-extrabold leading-loose antialiased">
              {post.title}
            </h2>
          </header>
          <section className="mb-6">
            <p className="leading-snug">{post.properties.Summary.text}</p>
            <time className="font-medium">{post.createdAt}</time>
          </section>
          <footer>
            <ul className="inline-flex gap-2">
              {post.properties.Topics.options.map((x) => (
                <li key={`${post.properties.Topics.name}-topic-${x.name}`}>
                  <button className="cursor-pointer">
                    <Topic color={x.color}>{x.name}</Topic>
                  </button>
                </li>
              ))}
            </ul>
          </footer>
        </section>
      ))}
    </div>
  );
};

export default Home;
