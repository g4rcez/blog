import React from "react";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  tag?: "div" | "section" | "header";
};
export const Container: React.FC<Props> = ({ tag: Tag = "section", children, ...props }) => (
  <Tag {...props} className={`mx-auto py-2 container w-full max-w-6xl ${props.className ?? ""}`}>
    {children}
  </Tag>
);
