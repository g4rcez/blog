"use client";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { RxFrame } from "react-icons/rx";
import { PrismAsyncLight as Syntax } from "react-syntax-highlighter";
import Input from "the-mask-input";
import {
    ExampleWithGlobalState,
    UseTypedReducerExample,
    UseTypedReducerPropsMiddleware,
} from "~/components/projects/use-typed-reducer";
import { Format } from "~/lib/format";
import { Themes, useTheme } from "./theme.config";

const HX = ({
    tag: Render,
    ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
    tag: `h${2 | 3 | 4 | 5 | 6}`;
}) => {
    const [text, setText] = useState("");
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!span.current) return;
        setText(Format.slug(span.current.innerText));
    }, []);

    return (
        <Render {...props} id={props.id ?? text} data-tag={Render}>
            <a className="font-extrabold no-underline group" href={`#${text}`}>
                <span className="inline-block duration-300 mr-2 text-lg opacity-30 transition-opacity active:opacity-100 group-hover:opacity-100">
                    <RxFrame className="mb-3" aria-hidden="true" />
                </span>
                <span ref={span}>{props.children}</span>
            </a>
        </Render>
    );
};

type PreTheme = {
    [Themes.Dark]: null | {};
    [Themes.Light]: null | {};
};

const Pre = (props: any) => {
    const { className, children } = props.children.props;
    const lang = (className ?? "").replace("language-", "");
    const [theme] = useTheme();
    const [codeStyle, setCodeStyle] = useState<any>({});
    const ref = useRef<PreTheme>({ [Themes.Dark]: null, [Themes.Light]: null });

    useEffect(() => {
        const async = async () => {
            const cache = ref.current[theme];
            if (cache === null) {
                const css =
                    theme === Themes.Dark ? await import("./dracula.theme") : await import("./material-light.theme");
                ref.current[theme] = css.default;
                return setCodeStyle(css.default);
            }
            return setCodeStyle(ref.current[theme]);
        };
        async();
    }, [theme]);

    return (
        <Syntax
            showLineNumbers
            language={lang}
            className="text-lg my-4 border dark:border-transparent border-slate-200"
            style={{ ...codeStyle, fontFamily: "monospace" }}
            codeTagProps={{ style: { fontFamily: "'Fira Code', monospace" } }}
        >
            {children?.trim?.()}
        </Syntax>
    );
};

export const MdxComponents = {
    pre: Pre,
    ExampleWithGlobalState,
    UseTypedReducerExample,
    UseTypedReducerPropsMiddleware,
    h1: (props: any) => <HX {...props} tag="h1" />,
    h2: (props: any) => <HX {...props} tag="h2" />,
    h3: (props: any) => <HX {...props} tag="h3" />,
    h4: (props: any) => <HX {...props} tag="h4" />,
    h5: (props: any) => <HX {...props} tag="h5" />,
    h6: (props: any) => <HX {...props} tag="h6" />,
    Input: (props: any) => (
        <Input {...props} className="p-2 border border-slate-300 dark:border-slate-400 rounded bg-transparent" />
    ),
    img: (props: any) => (
        <img {...props} loading="lazy" className={`block min-w-full w-full m-0 p-0 ${props.className}`} />
    ),
};

export const Markdown = (props: { mdx: MDXRemoteSerializeResult }) => (
    <Fragment>
        <MDXRemote
            frontmatter={null}
            scope={props.mdx.scope}
            components={MdxComponents}
            compiledSource={props.mdx.compiledSource}
        />
    </Fragment>
);
