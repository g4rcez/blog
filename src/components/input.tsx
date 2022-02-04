import { OmitKeys } from "~/lib/utility-types";

type Props<T> = OmitKeys<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "name"> & {
  name: keyof T;
};

export const Input: <T>(props: Props<T>) => JSX.Element = (props) => {
  return (
    <fieldset disabled={props.disabled} className={`relative h-16 ${props.className ?? ""}`}>
      <input
        {...props}
        name={props.name as never}
        className={`input bg-transparent border border-slate-200 dark:border-slate-600 block p-1 rounded absolute bottom-0 left-0 w-full`}
      />
      <label className="absolute top-0 left-0 text-base" htmlFor={props.name as never}>
        {props.placeholder}
      </label>
    </fieldset>
  );
};
