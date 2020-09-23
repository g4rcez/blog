import React, { useState } from "react";
import { useClassNames } from "../hooks/use-classnames";

const Item: React.FC = (p) => (
  <a
    href="#responsive-header"
    className="block hover:font-bold px-2 hover:underline mt-4 lg:inline-block lg:mt-0 text-base pr-4 link-animate"
  >
    {p.children}
  </a>
);

export const Navbar = () => {
  const [show, setShow] = useState(false);
  const toggleClassName = useClassNames(
    [show],
    { block: show, hidden: !show },
    "w-full flex-grow lg:flex lg:items-center lg:w-auto display-transition absolute md:relative -ml-1 md:ml-0 top-0 mt-10 md:mt-0 bg-primary w-full md:pb-0 pb-4"
  );

  const onToggle = () => setShow((bool) => !bool);

  return (
    <header className="justify-center flex w-full bg-primary">
      <nav className="flex items-center justify-between flex-wrap p-1 container">
        <div className="flex items-center flex-shrink-0 mr-6">
          <span className="font-bold text-xl tracking-tight">Blog</span>
        </div>
        <div className="block lg:hidden">
          <button onClick={onToggle} className="flex items-center px-3 py-2 border rounded text-base">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className={toggleClassName}>
          <div className="text-sm lg:flex-grow"></div>
          <div>
            <Item>Lab</Item>
            <Item>Posts</Item>
            <Item>Github</Item>
            <Item>About Me</Item>
          </div>
        </div>
      </nav>
    </header>
  );
};
