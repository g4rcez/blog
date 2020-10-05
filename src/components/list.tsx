import React from "react";
import { useClassNames } from "../hooks/use-classnames";

type UL = React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>

type List = UL & {
  relative?: boolean;
  paddingVertical?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;
};

export const List = React.forwardRef<HTMLUListElement, List>(
  ({ paddingVertical = 2, relative = true, className, ...props }, externalRef) => {
    const classNames = useClassNames(
      [className, paddingVertical],
      {
        relative: relative,
        "py-1": paddingVertical === 1,
        "py-2": paddingVertical === 2,
        "py-3": paddingVertical === 3,
        "py-4": paddingVertical === 4,
        "py-5": paddingVertical === 5,
        "py-6": paddingVertical === 6,
        "py-8": paddingVertical === 8,
        "py-10": paddingVertical === 10,
        "py-12": paddingVertical === 12,
        "py-16": paddingVertical === 16,
        "py-20": paddingVertical === 20,
        "py-24": paddingVertical === 24,
        "py-32": paddingVertical === 32,
        "py-40": paddingVertical === 40,
        "py-48": paddingVertical === 48,
        "py-56": paddingVertical === 56,
        "py-64": paddingVertical === 64
      },
      "list-none",
      className
    );
    return <ul {...props} ref={externalRef} className={classNames} />;
  }
);
