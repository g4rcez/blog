import { OmitKeys } from "~/lib/utility-types";

export type Props<T> = OmitKeys<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "name"> & {
  name: keyof T;
};

export const Textarea: <T>(props: Props<T>) => JSX.Element = (props) => (
  <fieldset aria-disabled={props.disabled} className="w-full block relative" disabled={props.disabled}>
    <textarea {...props} name={props.name as string} className={`input mt-8 w-full bg-transparent border rounded-lg p-1 block ${props.className}`} />
    <label className="top-0 left-0 absolute" htmlFor={props.name as string}>
      {props.placeholder}
    </label>
  </fieldset>
);
