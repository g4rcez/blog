import React from "react";
import { useClassNames } from "../hooks/use-classnames";

type LI = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>

export const ItemList: React.FC<LI> = ({ className, ...props }) => {
  const classNames = useClassNames([className], "w-full box-border text-left", className);
  return <li {...props} className={classNames} />;
};
