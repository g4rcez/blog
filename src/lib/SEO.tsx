import { Metadata } from "next";
import React, { Fragment } from "react";
import { Posts } from "./posts";

export namespace SEO {
    export const author = {
        twitter: "@garcez_allan",
        name: "Allan Garcez",
    };

    export const base = "https://garcez.dev";

    export const dynamic = <T extends `/${string}`>(url: T) => `https://garcez.dev${url}`;

    export const title = "Blog do Garcez";

    export const description =
        "Bem-vindo ao Blog do Garcez - o lugar onde compartilho minhas ideias e pensamentos em frontend, React, Typescript, CSS, JavaScript, e Node. Este blog é meu lugar de rascunho, onde escrevo sobre minhas experiências e aprendizados em minha jornada como desenvolvedor. Acredito que compartilhar conhecimentos e opiniões é a chave para o crescimento pessoal e profissional, por isso espero que você encontre valor em meus posts e contribua com suas próprias ideias e pensamentos. Acompanhe-me nesta jornada de aprendizado e descubra como melhorar suas habilidades em frontend.";

    export const keywords = [
        "Javascript",
        "Typescript",
        "CSS",
        "ReactJS",
        "React",
        "HTML",
        "HTML5",
        "Node",
        "Frontend",
        "Programação web",
        "Desenvolvimento web",
        "Web",
        "Browser",
        "Responsividade",
        "SEO",
    ].join(",");

    export const Index = () => {
        const title = "Blog do Garcez";
        return (
            <Fragment>
                <title key="title">{title}</title>
                <meta name="title" content={title} />
                <meta key="description" name="description" content={description} />
                <meta key="keywords" name="keywords" content={keywords} />
                <meta key="og:description" property="og:description" content={description} />
                <meta property="og:site_name" content="Blog do Garcez" />
                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={base} />
                <meta property="twitter:card" content="summary_large_image" />
                <meta key="twitter:description" property="twitter:description" content={description} />
                <meta property="twitter:site" content="@garcez.dev" />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:url" content={base} />
            </Fragment>
        );
    };

    export const Post = ({
        post,
        postUrl,
        openGraphImage,
    }: {
        post: Posts.Post;
        postUrl: string;
        openGraphImage: string;
    }): Metadata => {
        const title = `Garcez - ${post.title}`;
        const images= [{ url: openGraphImage, height: "280", width: "1050" }]
        return {
            title,
            description: post.description,
            keywords: post.subjects,
            openGraph: {
                description: post.description,
                images,
                title,
                type: "article",
                url: postUrl,
            },
            twitter: {
                card: "summary_large_image" as any,
                description: post.description,
                images,
                site: "@garcez.dev",
                creator: "@garcez.dev",
                title: `g4rcez/blog: ${post.title}`,
            }
        };
    };
}
