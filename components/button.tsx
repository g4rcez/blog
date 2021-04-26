import React, { ButtonHTMLAttributes, DetailedHTMLProps, useMemo } from "react";

type Button = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: React.FC<Button> = (props) => {
  const clx = props.className ?? "";
  return (
    <button
      {...props}
      className={`px-4 bg-transparent duration-500 transition-colors border rounded ${clx}`}
    />
  );
};
