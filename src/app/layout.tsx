import { Providers } from "@/app/providers";
import { Layout } from "@/components/layout";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "@/styles/tailwind.css";
import { PropsWithChildren } from "react";
import { BlogConfig } from "@/blog.config";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const lexend = Lexend({ subsets: ["latin"], display: "swap", variable: "--font-lexend" });

export const metadata: Metadata = {
    title: { template: `%s - ${BlogConfig.name}`, default: BlogConfig.name },
};

export default function RootLayout(props: PropsWithChildren<{}>) {
    return (
        <html
            lang="pt-BR"
            suppressHydrationWarning
            className={clsx("h-full antialiased", inter.variable, lexend.variable)}
        >
            <body className="flex min-h-full bg-white dark:bg-primary-darker">
                <Providers>
                    <Layout>{props.children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
