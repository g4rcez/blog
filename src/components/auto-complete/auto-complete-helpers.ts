import { Option } from "./auto-complete-types";
import { isEmpty } from "ramda";

export const isGroupOption = (option: Option) => !!Array.isArray(option?.items);
export const searchValue = (list: Option[], value: string): Option[] => {
  if (isEmpty(value)) {
    return list;
  }
  const lowerCase = value.toLowerCase();
  return list.filter((x) => {
    if (isGroupOption(x) && x.items?.length! > 0) {
      return true;
    }
    const val = x.value ?? "";
    const labelWithoutDiacritics = `${x.label}`.toLowerCase();
    const valueWithoutDiacritics = `${val}`.toLowerCase();
    const hasValue = valueWithoutDiacritics.includes(lowerCase);
    const hasLabel = labelWithoutDiacritics.includes(lowerCase);
    return hasValue || hasLabel;
  });
};

export const rec = (list: Option[], groupName?: string, level: number = 1): Option[] =>
  list.reduce((acc, el) => {
    if (isGroupOption(el)) {
      const recArray = rec(el.items as never, el.label, level + 1);
      return [...acc, { ...el, isGroup: true }, ...recArray];
    }
    if (groupName === undefined) {
      return [...acc, el];
    }
    return [...acc, { ...el, groupName, level }];
  }, [] as Option[]);
