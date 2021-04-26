import { ThemePreference } from "lib/theme-preference";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaLinkedin, FaMoon, FaSun } from "react-icons/fa";
import { SiReact } from "react-icons/si";
import { VscGithubInverted, VscTwitter } from "react-icons/vsc";
import Dark from "styles/dark.json";
import Light from "styles/light.json";
import "../styles/globals.css";

const Me = {
  TWITTER: "https://twitter.com/garcez_allan",
  GITHUB: "https://github.com/g4rcez",
  LINKEDIN: "https://www.linkedin.com/in/allan-garcez/",
};

function MyApp({ Component, pageProps, ...props }) {
  const [theme, setTheme] = useState<"dark" | "light" | null>(() => null);

  useEffect(() => {
    setTheme(() => (ThemePreference.prefersDark() ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (theme === null) return;
    const root = document.querySelector(":root")! as any;
    const json = theme === "dark" ? Dark : Light;
    ThemePreference.setCss(json, root);
    ThemePreference.saveTheme(theme);
  }, [theme]);

  const themeColor = useMemo(
    () => (theme === "dark" ? Dark.primary.DEFAULT : Light.primary.DEFAULT),
    []
  );

  const toggle = useCallback(() => {
    setTheme((p) => (p === "dark" ? "light" : "dark"));
  }, []);

  return (
    <main className="w-full container mx-auto md:px-6 px-4 sm:max-w-5xl">
      <Head>
        <title>Garcez Blog</title>
        <meta
          name="description"
          content="Javascript, Typescript, React e provas de conceito sobre diversos casos de frontend"
        />
        <meta
          name="keywords"
          content="Javascript,Typescript,React,CSS,HTML,Frontend,Microfrontend,Software Engineer"
        />
        <meta name="twitter:creator" content="@garcez_allan" />
        <meta name="theme-color" content={themeColor} />
      </Head>
      <header className="w-full flex flex-wrap flex-col gap-y-8 justify-center items-center mb-8 mt-2">
        <nav className="w-full mx-auto py-2 flex flex-row justify-between items-center">
          <Link href="/">
            <span className="flex items-center gap-x-2">
              <SiReact className="inline-block" />
              Garcez Blog
            </span>
          </Link>
          <span className="flex gap-x-4">
            <button
              onClick={toggle}
              className="bg-transparent cursor-pointer"
              type="button"
            >
              {theme === "dark" && <FaSun className="inline-block" />}
              {theme === "light" && <FaMoon className="inline-block" />}
            </button>
          </span>
        </nav>
      </header>
      <div className="w-full">
        <Component {...pageProps} />
      </div>
      <footer className="my-8 text-lg flex flex-row justify-center font-bold gap-x-4">
        <a href={Me.GITHUB} className="cursor-pointer">
          <VscGithubInverted />
        </a>
        <a
          href={Me.TWITTER}
          className="cursor-pointer transition-colors duration-500 hover:text-twitter"
        >
          <VscTwitter />
        </a>
        <a
          href={Me.LINKEDIN}
          className="cursor-pointer transition-colors duration-500 hover:text-linkedin"
        >
          <FaLinkedin />
        </a>
      </footer>
    </main>
  );
}

export default MyApp;
