import classNamesDedupe from "classnames/dedupe";
import { DependencyList, useMemo } from "react";

type ClassArray = ClassValue[];

type ClassDictionary = { [id: string]: any };

export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

export const useClassNames = (dependency: DependencyList, ...classes: ClassValue[]) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => classNamesDedupe(...classes), [dependency]);
