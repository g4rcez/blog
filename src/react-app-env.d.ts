/// <reference types="react-scripts" />
import React from "react";

type NoChildren<P> = (
  props: Omit<React.PropsWithChildren<P>, "children">,
  context?: any
) => ReactElement<any, any> | null;

type Nullable<T> = T | null;
