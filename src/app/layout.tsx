import { Providers } from "@/app/providers";
import { Layout } from "@/components/layout";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "@/styles/tailwind.css";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const lexend = Lexend({ subsets: ["latin"], display: "swap", variable: "--font-lexend" });

export const metadata: Metadata = {
    title: { template: "%s - Blog do Garcez", default: "Blog do Garcez" },
};

export default function RootLayout(props: PropsWithChildren<{}>) {
    return (
        <html
            lang="pt-BR"
            className={clsx("h-full antialiased", inter.variable, lexend.variable)}
            suppressHydrationWarning
        >
            <body className="flex min-h-full bg-white dark:bg-slate-900">
                <Providers>
                    <Layout>{props.children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
