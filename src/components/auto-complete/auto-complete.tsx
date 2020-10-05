import { isEmpty } from "ramda";
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { KeyboardString } from "../../lib/key-code";
import { scrollIntoView } from "../../lib/dom";
import { Input } from "../input";
import { useClassNames } from "../../hooks/use-classnames";
import { useOnClickOutside } from "../../hooks/use-on-click-outside";
import { List } from "../list";
import { isGroupOption, rec, searchValue } from "./auto-complete-helpers";
import { AutoCompleteGroup, AutoCompleteItem } from "./auto-complete-item";
import { Option } from "./auto-complete-types";
export type { Option } from "./auto-complete-types";

type Count = (n: number) => number;
const inc = (n: number) => n + 1;
const dec = (n: number) => n - 1;

const skipWhileGroup = (list: Option[], currentLevel: number, act: Count) => {
  let n = act(currentLevel);
  let item = list[n];
  while (isGroupOption(item)) {
    n = act(n);
    item = list[n];
  }
  return n;
};

const optionListToMap = (options: Option[]) => new Map(options.map((x) => [x.label, x]));

export type SimpleOption<T = unknown> = { label: string; value: string } & T;

type AutoCompleteProps = {
  placeholder: string;
  onSelect: <T>(option: SimpleOption<T>, name?: string) => void;
  options: Option[];
  value: string | null;
} & Partial<{
  autoFocus: boolean;
  containerClassName: string;
  name: string;
  loading: boolean;
  required: boolean;
  disabled: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onChangeText: (text: string) => void;
}>;
export const AutoComplete = React.forwardRef<HTMLInputElement, AutoCompleteProps>(
  (
    { onOpenMenu, required = true, containerClassName = "", onChangeText, disabled, loading, onCloseMenu, ...props },
    externalRef
  ) => {
    const defaultName = useMemo(() => `auto-complete-${Math.ceil(Math.random() * 100)}`, []);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(externalRef, () => inputRef.current!);
    const [value, setValue] = useState(() => props.value || "");
    const [show, setShow] = useState(false);
    const [listWalker, setListWalker] = useState(-1);
    const [list, setList] = useState<Option[]>([]);
    const plainList = useMemo(() => rec(props.options), [props.options]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState(new Map<string, Option>());
    const [currentItem, setCurrentItem] = useState<Option | null>(null);

    const dropdownClassName = useClassNames(
      [show],
      { "h-0 hidden": !show, block: show },
      "mt-8 height-transition rounded-sm auto-complete-box overflow-y-auto auto-complete-max absolute z-10 w-full"
    );

    const onClose = () => {
      setShow(false);
      setList(plainList);
      setListWalker(-1);
      setCurrentItem(null);
    };

    useOnClickOutside(containerRef, onClose);

    const onChangeInput = useCallback(
      (s: string | null = "") => {
        const notNullString = s ?? "";
        setValue(notNullString);
        return onChangeText?.(notNullString);
      },
      [onChangeText]
    );

    useEffect(() => {
      const item = plainList.find((x) => x.value === props.value);
      if (item) {
        return onChangeInput(item.label);
      }
      onChangeInput("");
    }, [props.value, onChangeInput, plainList]);

    useEffect(() => {
      const item = plainList.find((x) => x.value === value);
      if (item) {
        onChangeInput(item.label);
      }
      if (isEmpty(value)) {
        setMap(optionListToMap(plainList));
        return setList(plainList);
      }
      const list = searchValue(plainList, value);
      return setList(list);
    }, [value, plainList, onChangeInput]);

    useEffect(() => {
      if (show) {
        dropdownRef.current?.childNodes.forEach((element: any, i) => {
          if (i === listWalker) {
            scrollIntoView(dropdownRef.current!, element);
          }
        });
      }
    }, [listWalker, show]);

    useEffect(() => {
      if (show) {
        return onOpenMenu?.();
      }
      onCloseMenu?.();
      setList(plainList);
    }, [show, plainList, onCloseMenu, onOpenMenu]);

    const openMenu = useCallback(() => {
      onChangeInput("");
      setShow(true);
    }, [onChangeInput]);

    const onIconClick = useCallback(() => setShow((e) => !e), []);

    const onSelectValue = (a: Option) => {
      const item = map.get(a.label);
      if (item) {
        setCurrentItem(item);
        onChangeInput(a.label);
        props.onSelect(item as never, props.name);
        setTimeout(onClose, 250);
      }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => onChangeInput(e.target.value);

    const onEnter = () => {
      let currentWalker = 0;
      setListWalker((currentLevel) => {
        const n = skipWhileGroup(list, currentLevel, inc);
        currentWalker = n > list.length - 1 ? 0 : n;
        return currentWalker;
      });
      const current = list[currentWalker];
      if (current) {
        setShow(false);
        return onSelectValue(current);
      }
    };

    const onEsc = () => {
      setValue("");
      return setShow(false);
    };

    const onArrowUp = () => {
      setListWalker((currentLevel) => {
        const n = skipWhileGroup(list, currentLevel, dec);
        return n < 0 ? list.length - 1 : n;
      });
    };

    const onArrowDown = () => {
      setListWalker((currentLevel) => {
        const n = skipWhileGroup(list, currentLevel, inc);
        return n > list.length - 1 ? 0 : n;
      });
    };

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.persist();
      if (show === false) {
        setListWalker(-1);
      }
      setShow(true);
      const methods = {
        [KeyboardString.ArrowDown]: onArrowDown,
        [KeyboardString.ArrowUp]: onArrowUp,
        [KeyboardString.Enter]: onEnter,
        [KeyboardString.Esc]: onEsc
      };
      const k = e.key as KeyboardString;
      if (k in methods) {
        methods[k]();
      }
    };

    return (
      <div ref={containerRef} className={`relative inline-block w-full ${containerClassName}`}>
        <Input
          autoFocus={props.autoFocus}
          ref={inputRef}
          loading={loading}
          autoComplete="off"
          disabled={disabled}
          containerClassName="w-full"
          name={defaultName ?? props.name}
          onChange={onChange}
          onFocus={openMenu}
          onClick={openMenu}
          onKeyUp={onKeyUp}
          placeholder={props.placeholder}
          required={required}
          value={value}
          rightIcons={
            <span onClick={onIconClick} role="button">
              <BsChevronDown />
            </span>
          }
        />
        <List relative={false} ref={dropdownRef} className={dropdownClassName}>
          {list.map((x, index) => (
            <AutoCompleteItem
              {...x}
              index={index}
              currentItem={currentItem}
              currentActive={listWalker}
              key={`parent-${x.label}-item-auto-complete`}
              onClick={onSelectValue}
              onChange={(index: number) => onChangeInput(list[index].value)}
              group={AutoCompleteGroup}
            >
              {x.label}
            </AutoCompleteItem>
          ))}
        </List>
      </div>
    );
  }
);
