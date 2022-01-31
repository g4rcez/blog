import * as RadixSwitch from "@radix-ui/react-switch";
import React from "react";

type Props<T> = {
  name: keyof T;
  checked?: boolean;
  value?: "on" | "off";
  disabled?: boolean;
  required?: boolean;
  defaultChecked?: boolean;
  children?: React.ReactNode;
};

export const Switch: <T>(props: Props<T>) => JSX.Element = (props) => {
  return (
    <fieldset disabled={props.disabled} className="switch-container">
      <label className="flex gap-x-4 items-center justify-start">
        <span>{props.children}</span>
        <RadixSwitch.Root {...props} className="switch" name={props.name as string}>
          <RadixSwitch.Thumb />
        </RadixSwitch.Root>
      </label>
    </fieldset>
  );
};
