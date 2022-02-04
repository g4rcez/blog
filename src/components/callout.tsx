import { useCallback, useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Collapse } from "react-collapse";
import { OmitKeys } from "~/lib/utility-types";

type Props = OmitKeys<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onChange"> & {
  show?: boolean;
  closable?: boolean;
  onChange?: (state: boolean) => void;
};

export const Callout: React.FC<Props> = ({ show, onChange, closable, ...props }) => {
  const [controlledState, setControlledState] = useState(!!show);

  useEffect(() => {
    setControlledState(!!show);
  }, [show]);

  const onClick = useCallback(() => {
    setControlledState((prev) => {
      const newState = !prev;
      onChange?.(newState);
      return newState;
    });
  }, [onChange]);

  return (
    <Collapse as="section" aria-role="presentation" isOpened={controlledState}>
      <div className={`relative border-l-8 border rounded-r p-5 bg-slate-50 dark:bg-slate-800 ${props.className} dark:border-slate-700`}>
        <button className="absolute top-2 right-2 transition-all duration-300 link:text-red-400" aria-label="Close button" onClick={onClick}>
          <RiCloseFill aria-hidden="true" aria-label="Close button" />
        </button>
        {props.children}
      </div>
    </Collapse>
  );
};
