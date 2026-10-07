import { Posts } from "@/components/server/list-posts";
import { getPosts } from "@/components/server/posts";
import { getTranslation } from "@/lib/dictionary";

type Props = {
  q?: string;
  lang: string;
};
export function WelcomePosts(props: Props) {
  const value = Array.isArray(props.q) ? props.q[0] : props.q;
  const posts = getPosts(props.lang);
  const copy = getTranslation(props.lang).blog;
  return (
    <section className="w-full min-w-0 py-16 sm:py-20" aria-labelledby="all-posts">
      <div className="border-b border-border pb-5 sm:pb-6">
        <h2 id="all-posts" className="font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {copy.allPosts}
        </h2>
        <p className="mt-2 text-sm text-secondary-foreground">
          {copy.newestFirst}
        </p>
      </div>
      <Posts posts={posts} lang={props.lang} search={value} layout="grid" />
    </section>
  );
}
