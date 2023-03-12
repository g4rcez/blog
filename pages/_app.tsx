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
import { SEO } from "../lib/SEO";
import { useRouter } from "next/router";
import { IconContext } from "react-icons";

const googleFont =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap";

const Me = {
  GITHUB: "https://github.com/g4rcez",
  TWITTER: "https://twitter.com/garcez_allan",
  LINKEDIN: "https://www.linkedin.com/in/allan-garcez/",
};

function Root({
  Component,
  pageProps,
}: {
  Component: React.FC<unknown>;
  pageProps: any;
}) {
  const [theme, setTheme] = useTheme();
  const router = useRouter();

  useEffect(() => {
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
    setTheme((p) => (p === "dark" ? Themes.Light : Themes.Dark));
  }, []);

  return (
    <main className="w-full">
      <Head>
        <base
          href={
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://garcez.dev"
          }
        />
        <link rel="canonical" href={`https://garcez.dev${router.asPath}`} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="theme-color" content="#21272d" />
        <link href={googleFont} rel="stylesheet" />
        <link
          rel="preload"
          href={googleFont}
          as="style"
          onLoad={(e) => ((e.target as any).rel = "stylesheet")}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content={themeColor} />
        <meta name="twitter:creator" content={SEO.author.twitter} />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="Brazilian Portuguese" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content={SEO.author.name} />
        <meta property="og:type" content="website" />
      </Head>
      <Navbar toggle={toggle} theme={theme} />
      <div className="w-full container mx-auto block w-full lg:w-3/4 px-4 md:px-0">
        <Component {...pageProps} />
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
      <IconContext.Provider
        value={{ style: { verticalAlign: "middle", display: "inline-block" } }}
      >
        <Root {...props} />
      </IconContext.Provider>
    </ThemeProvider>
  );
}
