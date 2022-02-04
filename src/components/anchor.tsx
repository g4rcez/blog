import { Link } from "remix";
import { OmitKeys } from "~/lib/utility-types";

type Tag = "a" | typeof Link;

type Props = OmitKeys<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref" | "href"> & {
  tag?: Tag;
  to: string;
};
export const Anchor = ({ tag: Tag = Link, ...props }: Props) => {
  return (
    <Tag
      {...props}
      className={`link:underline underline-offset-4 link:text-sky-600 dark:link:text-sky-400 transition-all duration-300 ${props.className ?? ""}`}
    >
      {props.children}
    </Tag>
  );
};
