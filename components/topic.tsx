import React from "react";

const topicColorMap = {
  red: "bg-white",
  blue: "bg-blue-400",
  pink: "bg-white",
  orange: "bg-orange-400",
};

type TopicColor = keyof typeof topicColorMap;

export const Topic = (
  props: React.PropsWithChildren<{ color: TopicColor | string }>
) => {
  return (
    <span
      className={`${
        topicColorMap[props.color as TopicColor]
      } px-2 py-1 rounded-sm font-medium`}
    >
      {props.children}
    </span>
  );
};
