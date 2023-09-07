import { Inter } from "next/font/google";
import React, { Fragment, PropsWithChildren } from "react";
import { ClientRoot } from "~/components/client-root";
import { SEO } from "~/lib/SEO";
import "../styles/globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
});

const GA_TRACKING_ID = "G-GWZ4PNE2ZL";

const Me = {
  GITHUB: "https://github.com/g4rcez",
  TWITTER: "https://twitter.com/garcez_allan",
  LINKEDIN: "https://www.linkedin.com/in/allan-garcez/",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html
      className={`h-full antialiased ${inter.className}`}
      style={inter.style}
      lang="pt-BR"
    >
      <head>
        <title>Blog do Garcez</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="theme-color" content="#21272d" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        {/*<meta name="theme-color" content={themeColor} />*/}
        <meta name="twitter:creator" content={SEO.author.twitter} />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="Brazilian Portuguese" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content={SEO.author.name} />
        <meta property="og:type" content="website" />
        {GA_TRACKING_ID ? (
          <Fragment>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname, });`,
              }}
            />
          </Fragment>
        ) : null}
      </head>
      <body className="flex min-h-full flex-col bg-white dark:bg-zinc-900">
        <ClientRoot>{props.children}</ClientRoot>
      </body>
    </html>
  );
}