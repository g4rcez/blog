import React, { useImperativeHandle, useRef } from "react";
import { useClassNames } from "../hooks/use-classnames";
import { useWidthClass, Width } from "../hooks/use-width";
type Div = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type Container = {
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  wrap?: boolean;
  fit?: boolean;
};

export const Container: React.FC<Div & Container> = ({
  verticalAlign = false,
  horizontalAlign = false,
  fit = false,
  wrap = true,
  ...props
}) => {
  const clx = useClassNames(
    [props.className, wrap, verticalAlign, horizontalAlign],
    "flex w-full",
    {
      "h-fit": fit,
      "flex-wrap": wrap,
      "flex-no-wrap": !wrap,
      "justify-center": !!horizontalAlign,
      "items-center": !!verticalAlign
    },
    props.className
  );
  return <div {...props} className={clx} />;
};

type View = {
  horizontalAlign?: boolean;
  lg?: Width;
  md?: Width;
  sm?: Width;
  xl?: Width;
  verticalAlign?: boolean;
  width?: Width;
  wrap?: boolean;
};

export const View = React.forwardRef<HTMLDivElement, Div & View>(
  (
    {
      className,
      verticalAlign = false,
      horizontalAlign = false,
      wrap = true,
      width = "full",
      sm,
      md,
      xl,
      lg,
      ...props
    },
    externalRef
  ) => {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(externalRef, () => ref.current!);
    const full = useWidthClass(width, true);
    const lgClass = "lg:w-" + useWidthClass(lg || width);
    const mdClass = "md:w-" + useWidthClass(md || width);
    const xlClass = "xl:w-" + useWidthClass(xl || width);
    const smClass = "sm:w-" + useWidthClass(sm || width);
    const clx = useClassNames(
      [className, lgClass, mdClass, xlClass, smClass, wrap, verticalAlign, horizontalAlign, full],
      "flex",
      full,
      smClass,
      mdClass,
      lgClass,
      xlClass,
      {
        "flex-wrap": wrap,
        "flex-no-wrap": !wrap,
        "justify-center": !!horizontalAlign,
        "items-center": !!verticalAlign
      },
      className
    );
    return <div {...props} ref={ref} className={clx} />;
  }
);
