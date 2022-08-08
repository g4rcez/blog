import { Navbar } from "components/navbar";
import { ThemeProvider, Themes, useTheme } from "components/theme.config";
import { ThemePreference } from "lib/theme-preference";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo } from "react";
import { FaLinkedin } from "react-icons/fa";
import { VscGithubInverted, VscTwitter } from "react-icons/vsc";
import Dark from "../styles/dark.json";
import "../styles/globals.css";
import Light from "../styles/light.json";

const googleFont =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap";

const Me = {
  TWITTER: "https://twitter.com/garcez_allan",
  GITHUB: "https://github.com/g4rcez",
  LINKEDIN: "https://www.linkedin.com/in/allan-garcez/",
};

function Root({
  Component,
  pageProps,
}: {
  Component: React.FC<unknown>;
  pageProps: never;
}) {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    if (theme === null) return;
    const root = document.documentElement;
    const json = theme === "dark" ? Dark : Light;
    ThemePreference.setCss(json, root);
    ThemePreference.saveTheme(theme);
    root.classList.value = theme;
  }, [theme]);

  const themeColor = useMemo(
    () => (theme === "dark" ? Dark.primary.DEFAULT : Light.primary.DEFAULT),
    []
  );

  const toggle = useCallback(() => {
    setTheme((p) => (p === "dark" ? Themes.light : Themes.Dark));
  }, []);

  return (
    <main className="w-full">
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
      <Navbar toggle={toggle} theme={theme} />
      <div className="w-full container mx-auto md:px-6 px-4 block md:max-w-6xl">
        <Component {...(pageProps as any)} />
      </div>
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
    </main>
  );
}

export default function MyApp(props: any) {
  return (
    <ThemeProvider>
      <Root {...props} />
    </ThemeProvider>
  );
}
