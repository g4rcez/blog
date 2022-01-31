export const ActionButton = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <button {...props} className={`button bg-sky-700 link:bg-sky-900 border-sky-800 ${props.className ?? ""}`}>
    {props.children}
  </button>
);

export const EditButton = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <button {...props} className={`button bg-emerald-700 link:bg-emerald-900 border-emerald-800 ${props.className ?? ""}`}>
    {props.children}
  </button>
);
