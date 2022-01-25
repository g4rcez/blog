import { useCallback, useState } from "react";
import { RiSunFill, RiMoonFill } from "react-icons/ri";

const middleItems = [
  { title: "Posts", link: "" },
  { title: "Playground", link: "" },
  { title: "Projects", link: "" },
];

type Themes = "light" | "dark";

export const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const onToggleTheme = useCallback(() => {
    const root = document.documentElement;
    setTheme((prev) => {
      if (prev === "light") return "dark";
      return "light";
    });
    root.classList.toggle("dark");
  }, []);

  return (
    <header>
      <nav className="flex justify-between items-center">
        <a>g4rcez blog</a>
        <ul className="inline-flex py-2">
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
