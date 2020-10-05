import React from "react";
import { isGroupOption } from "./auto-complete-helpers";
import { useClassNames } from "../../hooks/use-classnames";
import { Option } from "./auto-complete-types";
import { ItemList } from "../item-list";
import { FaCheck } from "react-icons/fa";

const baseItemClassName = "cursor-pointer hover:bg-primary-light hover:text-on-base";

export type GroupProps = {
  label: React.ReactNode;
  className?: string;
};

const groupClassName = "font-bold text-dark-light px-1";
export const AutoCompleteGroup: React.FC<GroupProps> = (props) => {
  const clx = useClassNames([props.className], groupClassName, props.className);
  return <ItemList className={clx}>{props.label}</ItemList>;
};

export type OptionItem = Option & {
  currentActive: number;
  index: number;
  group: React.FC<GroupProps>;
  groupName?: string;
  hasGroup?: boolean;
  level?: number;
  currentItem: Option | null;
  onChange: (index: number) => void;
  onClick?: (a: Option) => void;
};

export const AutoCompleteItem: React.FC<OptionItem> = ({
  group: Group,
  currentActive,
  currentItem,
  index,
  onChange,
  level,
  groupName,
  hasGroup,
  ...props
}): any => {
  const isHover = index === currentActive;
  const itemClassName = useClassNames(
    [index, currentActive, hasGroup],
    {
      [`${baseItemClassName} pl-3`]: hasGroup,
      [`${baseItemClassName} px-2`]: !hasGroup,
      "bg-primary-light text-base font-bold": isHover
    },
    "flex justify-between items-center py-1"
  );

  const isActive = currentItem?.label === props.label && currentItem?.value === props?.value;

  const onClick = () => {
    props.onClick?.(props);
    return onChange(index);
  };

  if (isGroupOption(props)) {
    return Group(props);
  }

  if ((isHover && isActive) || isActive) {
    return (
      <ItemList id={`auto-complete-item-${index}`} {...props} className={itemClassName} onClick={onClick}>
        <span className="p-1">{props.label}</span>
        <span className="p-1">
          <FaCheck />
        </span>
      </ItemList>
    );
  }

  return (
    <ItemList id={`auto-complete-item-${index}`} {...props} className={itemClassName} onClick={onClick}>
      <span className="p-1">{props.label}</span>
    </ItemList>
  );
};
