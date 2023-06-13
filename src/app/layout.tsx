import React, { Fragment, PropsWithChildren } from "react";
import { SEO } from "~/lib/SEO";
import { VscGithubInverted, VscTwitter } from "react-icons/vsc";
import { FaLinkedin } from "react-icons/fa";
import "../styles/globals.css";
import { ClientRoot } from "~/components/client-root";
import { Inter } from "next/font/google";

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
    <html className={inter.className} style={inter.style} lang="pt-BR">
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
        <base
          href={
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://garcez.dev"
          }
        />
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
      <body>
        <ClientRoot>
          <div className="container mx-auto block w-full lg:w-3/4 px-4 md:px-0">
            {props.children}
          </div>
        </ClientRoot>
        <footer className="container mx-auto md:px-6 px-4 block md:max-w-6xl py-8">
          <div className="mt-8 mb-4 text-lg flex flex-row justify-center font-bold gap-x-4">
            <a href={Me.GITHUB} className="cursor-pointer" title="My Github">
              <span className="sr-only">My Github</span>
              <VscGithubInverted />
            </a>
            <a
              href={Me.TWITTER}
              title="My twitter"
              className="cursor-pointer transition-colors duration-500 hover:text-twitter"
            >
              <span className="sr-only">My Twitter</span>
              <VscTwitter />
            </a>
            <a
              href={Me.LINKEDIN}
              title="My Linkedin"
              className="cursor-pointer transition-colors duration-500 hover:text-linkedin"
            >
              <span className="sr-only">My Linkedin</span>
              <FaLinkedin />
            </a>
          </div>
          <div className="w-full block text-xs text-center pt-2">
            Sun/Moon icons made by{" "}
            <a
              href="https://www.freepik.com"
              title="Freepik"
              className="text-primary-link hover:underline italic"
            >
              Freepik
            </a>{" "}
            from{" "}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              className="text-primary-link hover:underline italic"
            >
              www.flaticon.com
            </a>{" "}
            <b className="mx-2">|</b> Brand Icons by{" "}
            <a
              className="text-primary-link hover:underline italic"
              href="https://react-icons.github.io/react-icons/"
            >
              react-icons
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
