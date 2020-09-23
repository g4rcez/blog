import React from "react";
import { useClassNames } from "../hooks/use-classnames";
import { Navbar } from "./navbar";

export const Body: React.FC<{ className?: string }> = (props) => {
  const className = useClassNames([props.className], props.className, "container m-auto mt-8 w-full flex");
  return (
    <main className="w-full">
      <Navbar />
      <div className={className}>{props.children}</div>
    </main>
  );
};
