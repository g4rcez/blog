import { Providers } from "@/app/providers";
import { Layout } from "@/components/layout";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/tailwind.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const lexend = localFont({ src: "../fonts/lexend.woff2", display: "swap", variable: "--font-lexend" });

export const metadata: Metadata = {
    title: { template: "%s - Blog do Garcez", default: "Blog do Garcez" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="pt-BR"
            className={clsx("h-full antialiased", inter.variable, lexend.variable)}
            suppressHydrationWarning
        >
            <body className="flex min-h-full bg-white dark:bg-gray-900">
                <Providers>
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
