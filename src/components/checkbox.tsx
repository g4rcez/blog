import { OmitKeys } from "~/lib/utility-types";

type Props<T> = OmitKeys<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "name" | "id"> & {
  name: keyof T;
};

export const Checkbox: <T>(props: Props<T>) => JSX.Element = (props) => {
  return (
    <fieldset aria-disabled={props.disabled} disabled={props.disabled} className="items-center flex gap-x-2">
      <input {...props} id={props.name as string} name={props.name as string} type="checkbox" className="checkbox" />
      <label className="text-base leading-snug font-bold cursor-pointer" htmlFor={props.name as string}>
        {props.placeholder}
      </label>
    </fieldset>
  );
};
