export const Anchor = (props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  return (
    <a
      {...props}
      className={`link:underline underline-offset-4 link:text-sky-600 dark:link:text-sky-400 transition-all duration-300 ${props.className ?? ""}`}
    >
      {props.children}
    </a>
  );
};
