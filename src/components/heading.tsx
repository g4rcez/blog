import React from "react";

export type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  description?: React.ReactNode;
};
export const Heading: React.FC<Props> = ({ tag: Tag = "h1", description, ...props }) => (
  <header className="block mb-12">
    <Tag {...props} className={`text-5xl font-extrabold leading-snug tracking-wide ${props.className}`}>
      {props.children}
    </Tag>
    {description && <p className="italic opacity-70">{description}</p>}
  </header>
);
