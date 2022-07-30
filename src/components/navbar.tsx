import { useCallback } from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { Link } from "@remix-run/react";
import { Links } from "~/lib/links";
import { Themes } from "~/lib/theme";
import { Anchor } from "./anchor";
import { useTheme } from "./theme.provider";

type MenuItems = { title: string; link: string };

type Props = {
  items: MenuItems[];
};

export const Navbar: React.FC<Props> = ({ items }) => {
  const [theme, setTheme] = useTheme();

  const onToggleTheme = useCallback(
    () => setTheme((prev) => (prev === "dark" ? Themes.Light : Themes.Dark)),
    []
  );

  return (
    <header className="w-full bg-zinc-900 text-white sticky top-0 mb-8 z-10">
      <nav className="flex justify-between items-center mx-auto container max-w-6xl py-2 text-xl px-4 sm:px-0">
        <Link to={Links.root}>
          <strong className="font-extrabold">g4rcez blog</strong>
        </Link>
        <ul className="inline-flex py-2" aria-hidden={`${items.length === 0}`}>
          {items.map((item) => (
            <li className="px-4 text-base" key={`navbar-${item.title}`}>
              <Anchor className="text-slate-400" to={item.link}>
                {item.title}
              </Anchor>
            </li>
          ))}
        </ul>
        <div className="flex text-2xl">
          <button
            onClick={onToggleTheme}
            name="mode-toggle"
            aria-label={
              theme === Themes.Dark
                ? "Change to light mode"
                : "Change to dark mode"
            }
          >
            <RiSunFill
              aria-hidden="true"
              className="hidden dark:block text-orange-200"
            />
            <RiMoonFill
              aria-hidden="true"
              className="block dark:hidden text-slate-400"
            />
          </button>
        </div>
      </nav>
    </header>
  );
};
