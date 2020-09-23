import React, { Fragment, useMemo } from "react";
import { isPropertySignature } from "typescript";
import { useClassNames } from "../hooks/use-classnames";

type HX = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export type TypographySize =
  | "text-2xl"
  | "text-sm"
  | "text-default"
  | "text-xl"
  | "text-lg"
  | "text-3xl"
  | "text-4xl"
  | "text-5xl"
  | "text-6xl";

type Title = {
  size?: TypographySize;
  truncate?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const isString = (u: unknown) => typeof u === "string";

export const SubTitle: React.FC<HX & Title> = ({ className, tag = "h2", size = "text-2xl", ...props }) => {
  const clx = useClassNames([className, size], "typography prose", size, className);
  const truncate = useMemo(() => props.truncate && isString(props.children), [props.truncate, props.children]);
  const text = useMemo(() => {
    if (truncate) {
      return `${props.children}`.slice(0, props.truncate);
    }
    return props.children;
  }, [props.children, props.truncate, truncate]);

  if (truncate) {
    const dotDotDot = (props?.children as string).length > props.truncate! ? "..." : "";
    return React.createElement(
      tag,
      { ...props, className: clx },
      <Fragment>
        {text}
        {dotDotDot}
      </Fragment>
    );
  }
  return React.createElement(tag, { ...props, className: clx }, text);
};

type Paragraph = {
  center?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

export const Paragraph: React.FC<Paragraph> = ({ className, center, ...props }) => {
  const clx = useClassNames(
    [className, center],
    "py-2 typography text-sm",
    {
      "text-justify": !center,
      "text-center": center
    },
    className
  );
  return <p {...props} className={clx} />;
};
