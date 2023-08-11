import Link from "next/link";
import { SiReact } from "react-icons/si";

type Props = {
  toggle: () => void;
  theme: string | null;
};

export const Navbar = ({ theme, toggle }: Props) => (
  <header className="w-full z-[100] flex text-lg bg-indigo-950 dark:bg-zinc-900 text-white sticky top-0 isolate print:hidden">
    <nav className="w-full lg:w-3/4 py-3 flex flex-row justify-between items-center container mx-auto px-4 lg:px-0">
      <h1>
        <Link className="flex items-center gap-x-2" href="/">
          <SiReact className="inline-block" />
        </Link>
      </h1>
      <span className="flex gap-x-4 items-center text-sm">
        <Link
          href={"/projects"}
          className="link:text-primary-link duration-300 transition-colors link:underline"
        >
          Projects
        </Link>
        <button onClick={toggle} className="bg-transparent cursor-pointer">
          <img
            width="24px"
            height="24px"
            alt={`${theme} mode icon"`}
            src={theme === "dark" ? "/moon.svg" : "/sun.svg"}
          />
        </button>
      </span>
    </nav>
  </header>
);
