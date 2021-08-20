import classNames from "classnames";
import React, {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const Polyfill = () => {
  if (!Element.prototype.scrollIntoTabIfNeeded) {
    Element.prototype.scrollIntoTabIfNeeded = function (this: HTMLElement) {
      const centerIfNeeded = true;

      var parent: any = this.parentNode,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(
          parentComputedStyle.getPropertyValue("border-top-width")
        ),
        parentBorderLeftWidth = parseInt(
          parentComputedStyle.getPropertyValue("border-left-width")
        ),
        overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom =
          this.offsetTop -
            parent.offsetTop +
            this.clientHeight -
            parentBorderTopWidth >
          parent.scrollTop + parent.clientHeight,
        overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight =
          this.offsetLeft -
            parent.offsetLeft +
            this.clientWidth -
            parentBorderLeftWidth >
          parent.scrollLeft + parent.clientWidth,
        alignWithTop = overTop && !overBottom;

      if ((overLeft || overRight) && centerIfNeeded) {
        parent.scrollLeft =
          this.offsetLeft -
          parent.offsetLeft -
          parent.clientWidth / 2 -
          parentBorderLeftWidth +
          this.clientWidth / 2;
      }

      if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
        this.scrollIntoView(alignWithTop);
      }
    };
  }
};

export {};

type TabProps = {
  id: string;
  title: React.ReactNode;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

declare global {
  interface Element {
    scrollIntoTabIfNeeded: (props: {
      behavior: string;
      block: string;
      inline: string;
    }) => void;
  }
}

const className =
  "flex flex-grow-0 flex-shrink-0 outline-none focus:outline-none";

export const Tab: React.FC<TabProps> = (props) => {
  const buttonClassName = useMemo(
    () =>
      classNames(
        "px-4 py-2 bg-transparent focus:border focus:border-primary-light",
        "outline-none focus:outline-none",
        {
          "text-primary-light font-bold": props.isActive,
        }
      ),
    [props.isActive]
  );

  return (
    <li
      role="tab link"
      id={props.id}
      style={{ outline: "none" }}
      aria-selected={props.isActive ? "true" : "false"}
      onClick={props.onClick}
      className={className}
    >
      <span role="link" className={buttonClassName}>
        {props.title}
      </span>
    </li>
  );
};

type TabsProps = {
  className?: string;
  inkBarColor?: string;
  tab: string;
  onChangeTab?: (tab: string) => void;
};

const calculateWidthSize = (ul: HTMLUListElement, id: string) => {
  let sum = 0;
  let elementIndex = -1;
  const list = ul.querySelectorAll("li");

  list.forEach((x, i) => {
    if (x.id === id) {
      elementIndex = i;
    }
    if (elementIndex === -1) {
      sum += x.getBoundingClientRect().width;
    }
  });
  return sum;
};

export const Tabs: React.FC<TabsProps> = ({ onChangeTab, ...props }) => {
  const inkBar = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLUListElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(props.tab ?? "");

  useLayoutEffect(() => {
    Polyfill();
    if (inkBar?.current && header.current) {
      const ul = header.current;
      const div = inkBar.current;
      const current = ul.querySelector(`#${active}`)!;
      const boundClient = calculateWidthSize(ul, active);
      div.style.left = `${boundClient}px`;
      div.style.width = `${current.getBoundingClientRect().width}px`;
      current.scrollIntoTabIfNeeded({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [active]);

  const containerClassName = useMemo(
    () =>
      classNames(
        "relative w-full tab-container overflow-x-auto flex flex-nowrap border-b border-gray",
        props.className
      ),
    [props.className]
  );

  const onTabClick = useCallback(
    (i: string) => () => {
      setActive(i);
      onChangeTab?.(i);
    },
    [onChangeTab]
  );

  const children = (
    React.Children.toArray(props.children).find(
      (x: any) => x.props.id === active
    ) as any
  )?.props?.children;

  return (
    <Fragment>
      <div className={containerClassName}>
        <div ref={inkBar} className="inkbar" />
        <ul
          ref={header}
          className="header-tab inline-flex flex-nowrap text-lg"
          role="tablist"
        >
          {React.Children.map(props.children, (x: any) => {
            const tabProps: TabProps = x.props;
            const isActive = active === tabProps.id;
            return (
              <Tab
                {...tabProps}
                key={`${tabProps.id}-li-tabs`}
                onClick={onTabClick(tabProps.id)}
                isActive={isActive}
              />
            );
          })}
        </ul>
      </div>
      <div className="w-full mt-4" ref={container}>
        {children}
      </div>
    </Fragment>
  );
};
