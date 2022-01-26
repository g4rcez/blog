import { useCallback, useEffect, useState } from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { Link } from "remix";
import { Links } from "~/lib/links";

const middleItems = [
  { title: "Posts", link: "" },
  { title: "Playground", link: "" },
  { title: "Projects", link: "" },
];

enum Themes {
  light = "light",
  dark = "dark",
  null = "",
}

const ThemesKey = "@blog/theme";

export const Navbar = () => {
  const [theme, setTheme] = useState<Themes>(Themes.null);

  useEffect(() => {
    const storageTheme: Themes = (window.localStorage.getItem(ThemesKey) as any) ?? Themes.light;
    const root = document.documentElement;
    if (storageTheme === Themes.dark) root.classList.add("dark");
  }, []);

  useEffect(() => {
    if (theme === Themes.null) {
      const storageTheme: Themes = (window.localStorage.getItem(ThemesKey) as any) ?? Themes.light;
      return setTheme(storageTheme);
    }
    window.localStorage.setItem(ThemesKey, theme);
  }, [theme]);

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement;
    setTheme((prev) => {
      if (prev === "light") return Themes.dark;
      return Themes.light;
    });
    root.classList.toggle("dark");
  }, []);

  return (
    <header className="w-full bg-zinc-900 text-white sticky top-0 mb-8 z-10">
      <nav className="flex justify-between items-center mx-auto container max-w-6xl py-4 text-xl">
        <Link to={Links.root}>
          <strong className="font-extrabold">g4rcez blog</strong>
        </Link>
        <ul className="inline-flex py-2 invisible" aria-hidden="true">
          {middleItems.map((item) => (
            <li className="px-4" key={`navbar-${item.title}`}>
              {item.title}
            </li>
          ))}
        </ul>
        <div className="flex text-2xl">
          <button onClick={onToggleTheme}>
            <RiSunFill aria-hidden="true" className="hidden dark:block text-orange-200" />
            <RiMoonFill aria-hidden="true" className="block dark:hidden text-slate-400" />
          </button>
        </div>
      </nav>
    </header>
  );
};
