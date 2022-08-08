import Link from "next/link";
import { SiReact } from "react-icons/si";

type Props = {
  toggle: () => void;
  theme: string | null;
};
export const Navbar = ({ theme, toggle }: Props) => {
  return (
    <header className="w-full flex mb-8 text-lg bg-zinc-900 text-white sticky top-0 z-50 isolate">
      <nav className="w-full py-3 flex flex-row justify-between items-center container mx-auto md:max-w-6xl md:px-6 px-4">
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
              src={theme === "dark" ? "/moon.svg" : "/sun.svg"}
            />
          </button>
        </span>
      </nav>
    </header>
  );
};
