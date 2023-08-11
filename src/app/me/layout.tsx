import React, { PropsWithChildren } from "react";
import "../../styles/globals.css";

export default function RootLayout(props: PropsWithChildren) {
  return (
    <div className="container mt-12 mx-auto lg:w-3/4 pb-12">{props.children}</div>
  );
}
