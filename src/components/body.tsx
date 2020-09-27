import React from "react";
import { useClassNames } from "../hooks/use-classnames";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const Body: React.FC<{ className?: string }> = (props) => {
  const className = useClassNames([props.className], props.className, "container m-auto mt-8 w-full flex px-3 md:px-0");
  return (
    <main className="w-full mb-4 flex flex-col min-h-screen flex-auto">
      <Navbar />
      <div className={className}>{props.children}</div>
      <Footer />
    </main>
  );
};
