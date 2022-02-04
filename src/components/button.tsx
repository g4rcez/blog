type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button = (props: Props) => (
  <button
    {...props}
    className={`px-4 py-1 border text-lg font-medium rounded-md min-w-[2rem] transition-all duration-300 text-slate-200 ${props.className ?? ""}`}
  >
    {props.children}
  </button>
);
export const ActionButton = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <Button {...props} className={`bg-main link:bg-main-dark link:border-main-dark border-main flex items-center text-center ${props.className ?? ""}`}>
    {props.children}
  </Button>
);

export const EditButton = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <Button {...props} className={`bg-emerald-700 link:bg-emerald-900 border-emerald-800 ${props.className ?? ""}`}>
    {props.children}
  </Button>
);

export const ResetButton = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <Button {...props} className={`bg-orange-400 link:bg-orange-500 border-orange-500 ${props.className ?? ""}`}>
    {props.children}
  </Button>
);
