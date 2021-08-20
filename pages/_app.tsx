import { ThemeProvider, useDarkMode } from "components/use-dark-mode";
import { ThemePreference } from "lib/theme-preference";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { SiReact } from "react-icons/si";
import { VscGithubInverted, VscTwitter } from "react-icons/vsc";
import Dark from "styles/dark.json";
import Light from "styles/light.json";
import "../styles/globals.css";

const googleFont =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap";

const Me = {
  TWITTER: "https://twitter.com/garcez_allan",
  GITHUB: "https://github.com/g4rcez",
  LINKEDIN: "https://www.linkedin.com/in/allan-garcez/",
};

function App({
  Component,
  pageProps,
}: {
  Component: React.FC<unknown>;
  pageProps: never;
}) {
  const { toggle, themeColor, theme } = useDarkMode();

  return (
    <main className="w-full container mx-auto md:px-6 px-4 block md:max-w-6xl">
      <Head>
        <title>Garcez Blog</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1"
        />
        <meta name="theme-color" content="#21272d" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link href={googleFont} rel="stylesheet" />
        <link
          rel="preload"
          href={googleFont}
          as="style"
          onLoad={(e) => ((e.target as any).rel = "stylesheet")}
        />
        <meta
          name="description"
          content="Javascript, Typescript, React e provas de conceito sobre diversos casos de frontend"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="keywords"
          content="Javascript,Typescript,React,CSS,HTML,Frontend,Microfrontend,Software Engineer"
        />
        <meta name="twitter:creator" content="@garcez_allan" />
        <meta name="theme-color" content={themeColor} />
      </Head>
      <header className="w-full flex flex-wrap gap-y-8 justify-center items-center mb-8 mt-2 text-lg">
        <nav className="w-full mx-auto py-2 flex flex-row justify-between items-center">
          <Link href="/">
            <a href="/">
              <span className="flex items-center gap-x-2">
                <SiReact className="inline-block" />
                Garcez Blog
              </span>
            </a>
          </Link>
          <span className="flex gap-x-4">
            <button
              onClick={toggle}
              className="bg-transparent cursor-pointer mb-1"
            >
              <img
                width="24px"
                height="24px"
                alt={`${theme} mode icon"`}
                src={theme.name === "dark" ? "/moon.svg" : "/sun.svg"}
              />
            </button>
          </span>
        </nav>
      </header>
      <div className="w-full">
        <Component {...pageProps} />
      </div>
      <footer className="mb-2">
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
        <div className="w-full block text-xs text-center">
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
    </main>
  );
}

export default function Entrypoint({
  Component,
  pageProps,
}: {
  Component: React.FC<unknown>;
  pageProps: never;
}) {
  return (
    <ThemeProvider>
      <App Component={Component} pageProps={pageProps} />
    </ThemeProvider>
  );
}
