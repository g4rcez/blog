import React from "react";

type InlineLoadingProps = {
  text?: string;
  size?: number;
  className?: string;
};

export const SpinLoading: React.FC<InlineLoadingProps> = ({ size = 1, ...props }) => (
  <span className={props.className}>
    <span className="circonf circonf-2" style={{ width: `${size}rem`, height: `${size}rem` }} />
    {props.text && <span className="pl-1">{props.text}</span>}
  </span>
);
