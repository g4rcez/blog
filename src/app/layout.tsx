import { Providers } from "@/app/providers";
import { BlogConfig } from "@/blog.config";
import { Layout } from "@/components/layout";
import { darkColors } from "@/styles/dark";
import { lightColors } from "@/styles/light";
import { defaultDarkTheme, defaultLightTheme } from "@g4rcez/components/themes";
import { createTheme } from "@g4rcez/components/styles";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "@/styles/tailwind.css";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const lexend = Lexend({ subsets: ["latin"], display: "swap", variable: "--font-lexend" });

export const metadata: Metadata = {
    title: {
        template: `%s - ${BlogConfig.name["pt-BR"]}`,
        default: BlogConfig.name["pt-BR"],
    },
};

export default async function RootLayout(props: PropsWithChildren<{ params: Promise<{ lang?: string }> }>) {
    const params = await props.params;
    const lang = params.lang || "pt-BR";
    return (
        <html
            lang={lang}
            suppressHydrationWarning
            className={clsx("h-full antialiased dark", inter.variable, lexend.variable)}
        >
            <head>
                <title>Blog</title>
                <meta charSet="utf-8" />
                <style data-name="theme" id="theme-dark">
                    {createTheme({ ...defaultDarkTheme, colors: darkColors }, "dark")}
                </style>
            </head>
            <body className="flex min-h-full bg-background">
                <Providers lang={lang}>
                    <Layout>{props.children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
