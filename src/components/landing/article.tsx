"use client";
import clsx from "clsx";
import Link from "next/link";
import { HTMLAttributes, PropsWithChildren, useEffect, useRef, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
});

export function FormattedDate({ date, ...props }: { date: Date | string | null; className?: string }) {
    if (date === null) {
        return null;
    }
    const d = typeof date === "string" ? new Date(date) : date;
    return (
        <time dateTime={d.toISOString()} {...props}>
            {dateFormatter.format(d)}
        </time>
    );
}

const ContentWrapper = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
            <div {...props} className={clsx("mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto", className)} />
        </div>
    </div>
);

const ArticleHeader = ({ id, date }: { id: string; date: Date | null }) => (
    <header className="relative mb-10 xl:mb-0">
        <div className="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8">
            <Link href={`#${id}`} className="inline-flex">
                <FormattedDate
                    date={date}
                    className="hidden xl:pointer-events-auto xl:block xl:text-2xs/4 xl:font-medium dark:xl:text-white/50"
                />
            </Link>
            <div className="h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300" />
        </div>
        <ContentWrapper>
            <div className="flex">
                <Link href={`#${id}`} className="inline-flex text-black">
                    <FormattedDate
                        date={date}
                        className="text-2xs/5 font-medium xl:hidden dark:text-indigo-200 xl:text-black"
                    />
                </Link>
            </div>
        </ContentWrapper>
    </header>
);

export const Article = ({ id, date, children }: PropsWithChildren<{ id: string; date: Date | null }>) => {
    const heightRef = useRef<HTMLDivElement>(null);
    const [heightAdjustment, setHeightAdjustment] = useState(0);

    useEffect(() => {
        let observer = new window.ResizeObserver(() => {
            if (!heightRef.current) {
                return;
            }
            let { height } = heightRef.current.getBoundingClientRect();
            let nextMultipleOf8 = 8 * Math.ceil(height / 8);
            setHeightAdjustment(nextMultipleOf8 - height);
        });
        observer.observe(heightRef.current!);
        return () => observer.disconnect();
    }, []);

    return (
        <article id={id} className="scroll-mt-16" style={{ paddingBottom: `${heightAdjustment}px` }}>
            <div ref={heightRef}>
                <ArticleHeader id={id} date={date} />
                <ContentWrapper className="typography" data-mdx-content>
                    {children}
                </ContentWrapper>
            </div>
        </article>
    );
};
