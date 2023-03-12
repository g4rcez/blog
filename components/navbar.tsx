import Link from "next/link";
import { SiReact } from "react-icons/si";

type Props = {
  toggle: () => void;
  theme: string | null;
};
export const Navbar = ({ theme, toggle }: Props) => {
  return (
    <header className="w-full flex mb-6 text-lg bg-on-base dark:bg-black/20 backdrop-blur-xl text-white sticky top-0 z-50 isolate">
      <nav className="w-full lg:w-3/4 py-3 flex flex-row justify-between items-center container mx-auto px-4 md:px-0">
        <h1>
          <Link className="flex items-center gap-x-2" href="/">
            <SiReact className="inline-block" />
            Blog do Garcez
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
};
