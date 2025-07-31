import { Posts } from "@/components/server/list-posts";
import { getPosts } from "@/components/server/posts";

type Props = {
  q?: string;
  lang: string;
};
export function WelcomePosts(props: Props) {
  const value = Array.isArray(props.q) ? props.q[0] : props.q;
  const posts = getPosts(props.lang);
  return (
    <div className="flex-auto px-4 min-w-0 max-w-2xl lg:pr-0 lg:pl-8 lg:max-w-none xl:px-16">
      <Posts posts={posts} lang={props.lang} search={value} />
    </div>
  );
}
