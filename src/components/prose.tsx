import clsx from "clsx";
import type React from "react";

export const Prose = <T extends React.ElementType = "div">({
    as,
    className,
    ...props
}: React.ComponentPropsWithoutRef<T> & {
    as?: T;
}) => {
    const Component = as ?? "div";
    return (
        <Component
            {...props}
            className={clsx(
                className,
                "prose prose-slate max-w-none text-foreground dark:prose-invert",
                "prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-medium",
                "prose-p:leading-8 prose-li:leading-7",
                "prose-a:font-medium prose-a:text-primary-hover prose-a:underline prose-a:decoration-primary prose-a:underline-offset-4 prose-a:focus-visible:outline-2 prose-a:focus-visible:outline-offset-2 prose-a:focus-visible:outline-primary dark:prose-a:text-primary",
                "prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-slate-950 prose-pre:shadow-none",
                "prose-img:rounded-lg",
            )}
        />
    );
};
