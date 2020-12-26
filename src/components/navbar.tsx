import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useClassNames } from "../hooks/use-classnames";
import { Links } from "../routes/links";

const Item: React.FC<{ to: string }> = (p) => (
  <Link
    to={p.to}
    className="items-center flex hover:font-bold px-2 hover:underline mt-4 lg:inline-flex lg:mt-0 text-base pr-4 link-animate w-full"
  >
    {p.children}
  </Link>
);

export const Navbar = () => {
  const [show, setShow] = useState(false);
  const toggleClassName = useClassNames(
    [show],
    { block: show, hidden: !show },
    "flex-col flex-grow lg:flex lg:items-center lg:w-auto display-transition",
    "w-full absolute md:relative",
    "-ml-1 md:ml-0 top-0 mt-10 md:mt-0 bg-primary w-full md:pb-0 pb-4 justify-end"
  );

  const onToggle = () => setShow((bool) => !bool);

  return (
    <header className="justify-center flex bg-primary w-full max-w-full">
      <nav className="flex items-center justify-between flex-wrap p-1 container">
        <div className="flex items-center flex-shrink-0 mr-6 pl-2 md:pl-0">
          <Link to={Links.root} className="font-bold text-xl tracking-tight">
            Blog
          </Link>
        </div>
        <div className="block lg:hidden pr-2">
          <button onClick={onToggle} className="flex items-center px-3 py-2 border rounded text-base">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className={toggleClassName}>
          <div className="flex-auto flex flex-col md:flex-row w-auto ml-auto justify-end">
            <Item to={Links.Linq}>Lab</Item>
            <Item to={Links.me}>Me</Item>
            <Item to={Links.settings}> <FaCog title="Settings" /> <span className="ml-1 visible md:hidden"> Settings</span> </Item>
          </div>
        </div>
      </nav>
    </header>
  );
};
