import React from "react";

type Span = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
export const Tag = (props: Span) => {
  return (
    <span
      {...props}
      className="rounded cursor-pointer hover:bg-primary-light bg-primary bg-animate uppercase px-2 py-1 text-center text-xs mb-3 mr-2"
    />
  );
};
