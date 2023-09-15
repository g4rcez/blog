import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Metadata } from "next";
import Link, { LinkProps } from "next/link";
import { Fragment, PropsWithChildren, useId } from "react";
import { Article } from "~/components/landing/article";
import { I18n } from "~/i18n/i18n";
import { CMS } from "~/lib/cms";
import { Posts } from "~/lib/posts";
import { me } from "~/me";

const Glow = () => {
    const id = useId();
    return (
        <div className="absolute opacity-20 dark:opacity-100 dark:bg-neutral-950 inset-0 -z-10 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem]">
            <svg
                className="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:-right-40 lg:bottom-auto lg:left-auto lg:top-[-40%] lg:h-[180%] lg:w-[80rem]"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id={`${id}-desktop`} cx="100%">
                        <stop offset="0%" stopColor="rgba(56, 40, 200, 0.2)" />
                        <stop offset="50%" stopColor="rgba(40, 75, 255, 0.1)" />
                        <stop offset="100%" stopColor="rgba(0, 14, 23, 0)" />
                    </radialGradient>
                    <radialGradient id={`${id}-mobile`} cy="100%">
                        <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
                        <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
                        <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${id}-desktop)`} className="hidden lg:block" />
                <rect width="100%" height="100%" fill={`url(#${id}-mobile)`} className="lg:hidden" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 right-0 h-px bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px" />
        </div>
    );
};

const Timeline = () => {
    const id = useId();
    return (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-visible">
            <svg
                className="absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0"
                aria-hidden="true"
            >
                <defs>
                    <pattern id={id} width="6" height="8" patternUnits="userSpaceOnUse">
                        <path d="M0 0H6M0 8H6" className="dark:stroke-white/10 xl:stroke-black/10" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${id})`} />
            </svg>
        </div>
    );
};

const FixedSidebar = (props: PropsWithChildren) => (
    <div className="relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex lg:px-0">
        <Glow />
        <div className="relative flex w-full lg:pointer-events-auto lg:mr-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[45rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-[max(4rem,calc(50%-38rem))]">
            <div className="mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
                <main className="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">{props.children}</main>
                <div className="flex flex-1 items-end justify-center pb-4 lg:pb-6 opacity-0"></div>
            </div>
        </div>
    </div>
);

const IconLink = ({
    children,
    className,
    compact = false,
    large = false,
    icon: Icon,
    ...props
}: PropsWithChildren<
    LinkProps & {
        icon: any;
        compact?: boolean;
        className: string;
        large?: boolean;
    }
>) => (
    <Link
        {...props}
        className={clsx(
            className,
            "group relative flex items-center rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-slate-600 dark:text-white/30 transition-colors hover:text-indigo-300",
            compact ? "gap-x-2" : "gap-x-3"
        )}
    >
        <span className="absolute inset-0 -z-10 scale-75 rounded-lg bg-white/5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
        {Icon && <Icon className={clsx("flex-none", large ? "h-6 w-6" : "h-4 w-4")} />}
        <span className="self-baseline dark:text-white">{children}</span>
    </Link>
);

const Tags = ({ tags, id }: { tags: string[]; id: string }) => (
    <ul className="flex flex-row gap-4 text-xs my-2 flex-wrap">
        {tags.map((x) => (
            <li key={`${id}-${x}-tag`} className="px-4 py-1 bg-indigo-900 text-white rounded-lg">
                <Link href={`?q=${x}`}>{x}</Link>
            </li>
        ))}
    </ul>
);

function Intro({ tags }: { tags: string[] }) {
    const fmt = new I18n.Fmt(I18n.DEFAULT_LOCALE);
    return (
        <Fragment>
            <nav>
                <Link href="/">Blog do Garcez</Link>
            </nav>
            <h1 className="mt-6 font-display text-4xl/tight font-medium dark:text-white">{fmt.get("welcomeTitle")}</h1>
            <p className="mt-4 text-md/6 dark:text-zinc-200">{fmt.get("welcome")}</p>
            <div className="flex flex-col">
                <form className="border text-sm dark:border-slate-600 border-slate-300 flex flex-row items-center flex-nowrap text-white w-full rounded-lg my-4">
                    <input
                        name="q"
                        className="bg-transparent p-2.5 w-full placeholder-slate-600"
                        placeholder="Busque por..."
                    />
                    <button className="p-1.5 px-4 bg-indigo-800 mx-1 rounded-lg flex text-sm">Buscar</button>
                </form>
                <p className="my-2">Ou busque pelos assuntos existentes</p>
                <Tags tags={tags} id="tag-filter" />
            </div>
            <nav className="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
                <IconLink
                    href="https://www.linkedin.com/in/allan-garcez/"
                    icon={LinkedInLogoIcon}
                    className="flex-none"
                >
                    LinkedIn
                </IconLink>
                <IconLink href="https://github.com/g4rcez" icon={GitHubLogoIcon} className="flex-none">
                    GitHub
                </IconLink>
                <IconLink href="https://twitter.com/garcez_allan" icon={TwitterLogoIcon} className="flex-none">
                    <s>Twitter</s> X
                </IconLink>
            </nav>
        </Fragment>
    );
}

export default function NewPage(props: any) {
    const search = ((props.searchParams.q as string) ?? "").toLocaleLowerCase();
    const allPosts = Posts.all();
    const filter = search
        ? allPosts.filter((x) => {
              if (x.title.toLocaleLowerCase().includes(search)) return true;
              if (x.description.toLocaleLowerCase().includes(search)) return true;
              return x.subjects.some((s) => s.toLocaleLowerCase().includes(search));
          })
        : allPosts;
    const posts = CMS.sort(filter);
    const subjects = [...new Set(allPosts.flatMap((post) => post.subjects))];

    return (
        <Fragment>
            <FixedSidebar>
                <Intro tags={subjects} />
            </FixedSidebar>
            <div className="relative flex-auto">
                <Timeline />
                <main className="space-y-20 bg-transparent dark:text-slate-100 py-20 sm:space-y-32 sm:py-32">
                    {posts.map((post) => (
                        <Article id={post.title} date={new Date(post.date)}>
                            <header>
                                <Link href={post.href}>
                                    <p className="opacity-70 text-sm">{post.readingTime} min</p>
                                    <h3 className="font-bold text-2xl my-2">{post.title}</h3>
                                </Link>
                            </header>
                            <p className="text-sm text-slate-400">{post.description}</p>
                            <Tags tags={post.subjects} id={post.title} />
                        </Article>
                    ))}
                </main>
            </div>
        </Fragment>
    );
}

export const metadata: Metadata = {
    creator: "Allan Garcez",
    description: me.aboutBlog,
    generator: "Next.js",
    title: "Blog do Garcez",
    metadataBase: new URL(me.page),
    keywords: me.skills.map((x) => x.name),
    authors: me.contacts.map((x) => ({ name: x.label, url: x.link })),
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#475569" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};
