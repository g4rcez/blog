"use client";
import { BlogConfig } from "@/blog.config";
import { Button } from "@/components/button";
import { HeroBackground } from "@/components/hero-background";
import { useTranslation } from "@/lib/i18n";
import clsx from "clsx";
import { Highlight } from "prism-react-renderer";
import React, { Fragment, useState } from "react";
import { Shell } from "./terminal";

const codeLanguage = "jsx";

const code = `export default function Blog() {
    return (
        <Page>
            <Title>${BlogConfig.author}</Title>
            <GithubUser user="${BlogConfig.author}" />
        </Page>
    )
}`

const tabs = [
    {
        name: "blog.config.tsx",
        children: (
            <Fragment>
                <div className="flex items-start px-1 mt-6 text-sm">
                    <div
                        aria-hidden="true"
                        className="pr-4 font-mono border-r select-none border-slate-300/5 text-slate-600"
                    >
                        {Array.from({ length: code.split("\n").length }).map((_, index) => (
                            <Fragment key={index}>
                                {(index + 1).toString().padStart(2, "0")}
                                <br />
                            </Fragment>
                        ))}
                    </div>
                    <Highlight code={code} language={codeLanguage} theme={{ plain: {}, styles: [] }}>
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className={clsx(className, "flex overflow-x-auto pb-6")} style={style}>
                                <code className="px-4">
                                    {tokens.map((line, lineIndex) => (
                                        <div key={lineIndex} {...getLineProps({ line })}>
                                            {line.map((token, tokenIndex) => (
                                                <span key={tokenIndex} {...getTokenProps({ token })} />
                                            ))}
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        )}
                    </Highlight>
                </div>
            </Fragment>
        ),
    },
    {
        name: "terminal.sh",
        children: <div className="p-2">
            <Shell className="text-base" />
        </div>,
    },
];

function TrafficLightsIcon(props: React.ComponentPropsWithoutRef<"svg">) {
    return (
        <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
            <circle className="fill-red-400" cx="5" cy="5" r="4.5" />
            <circle className="fill-yellow-400" cx="21" cy="5" r="4.5" />
            <circle className="fill-green-400" cx="37" cy="5" r="4.5" />
        </svg>
    );
}

export function Hero() {
    const { t } = useTranslation();
    const [active, setActive] = useState(tabs[0]);
    return (
        <div className="overflow-hidden dark:pb-32 dark:-mb-32 bg-background dark:mt-[-4.75rem] dark:pt-[4.75rem]">
            <div className="py-16 sm:px-2 lg:relative lg:py-20 lg:px-0">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 items-center px-4 mx-auto max-w-2xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12 lg:max-w-8xl">
                    <div className="relative z-10 md:text-center lg:text-left">
                        <div className="relative">
                            <p className="inline text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-glow-left via-glow-middle to-glow-right font-display">
                                {t("hero.title")}
                            </p>
                            <p className="mt-3 text-xl tracking-tight text-primary-foreground/70">
                                {t("hero.subtitle")}
                            </p>
                            <div className="flex gap-4 mt-8 md:justify-center lg:justify-start">
                                <Button href="https://github.com/g4rcez">{t("hero.github")}</Button>
                                <Button href="https://www.linkedin.com/in/allan-garcez/">{t("hero.linkedin")}</Button>
                                <Button href="https://twitter.com/garcez_allan" variant="secondary">
                                    <del>{t("hero.twitter")}</del>X
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="relative lg:static xl:pl-10">
                        <div className="absolute inset-x-[-50vw] -bottom-48 -top-32 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,white,transparent)] lg:-bottom-32 lg:-top-32 lg:left-[calc(50%+14rem)] lg:right-0 lg:[mask-image:none] lg:dark:[mask-image:linear-gradient(white,white,transparent)]">
                            <HeroBackground className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr rounded-2xl opacity-10 from-glow-left via-glow-left/70 to-glow-right blur-lg" />
                            <div className="absolute inset-0 bg-gradient-to-tr rounded-2xl opacity-10 from-glow-left via-glow-left/70 to-glow-right" />
                            <div className="relative rounded-2xl ring-1 bg-glow-glass/80 ring-white/10 backdrop-blur-lg">
                                <div className="absolute right-11 left-20 -top-px h-px bg-gradient-to-r from-glow-left/0 via-glow-right/70 to-glow-right/0" />
                                <div className="absolute left-11 right-20 -bottom-px h-px bg-gradient-to-r from-glow-left/0 via-glow-right to-glow-right/0" />
                                <div className="pt-4 pl-4">
                                    <TrafficLightsIcon className="w-auto h-2.5 stroke-slate-500/30" />
                                    <div className="flex mt-4 space-x-2 text-xs">
                                        {tabs.map((tab) => {
                                            const isActive = tab === active;
                                            return (
                                                <button
                                                    type="button"
                                                    key={tab.name}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActive(tab)
                                                    }}
                                                    className={clsx(
                                                        "flex h-6 rounded-full transition-colors duration-300 ease-out",
                                                        isActive
                                                            ? "bg-gradient-to-r from-sky-400/30 via-sky-400 to-sky-400/30 p-px font-medium text-sky-300"
                                                            : "text-foreground/60 hover:bg-primary-hover/40",
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            "flex items-center rounded-full px-2.5",
                                                            isActive && "bg-slate-800",
                                                        )}
                                                    >
                                                        {tab.name}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {active.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
