import classNamesDedupe from "classnames/dedupe";
import { useMemo } from "react";

type MediaScreen = "width" | "lg" | "xl" | "md" | "sm";

export type WidthObject = Record<MediaScreen, Width>;

export type Width =
  | "auto"
  | "1/2"
  | "1/3"
  | "2/3"
  | "1/4"
  | "2/4"
  | "3/4"
  | "1/5"
  | "2/5"
  | "3/5"
  | "4/5"
  | "1/6"
  | "2/6"
  | "3/6"
  | "4/6"
  | "5/6"
  | "1/12"
  | "2/12"
  | "3/12"
  | "4/12"
  | "5/12"
  | "6/12"
  | "7/12"
  | "8/12"
  | "9/12"
  | "10/12"
  | "11/12"
  | "full"
  | "screen"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20"
  | "24"
  | "32"
  | "40"
  | "48"
  | "56"
  | "64";

export const useWidthClass = (w: Width, concatW: boolean = false) => {
  const width = `w-${w}`;
  const measure = useMemo(
    () =>
      classNamesDedupe({
        auto: "w-auto" === width,
        "1/2": "w-1/2" === width,
        "1/3": "w-1/3" === width,
        "2/3": "w-2/3" === width,
        "1/4": "w-1/4" === width,
        "2/4": "w-2/4" === width,
        "3/4": "w-3/4" === width,
        "1/5": "w-1/5" === width,
        "2/5": "w-2/5" === width,
        "3/5": "w-3/5" === width,
        "4/5": "w-4/5" === width,
        "1/6": "w-1/6" === width,
        "2/6": "w-2/6" === width,
        "3/6": "w-3/6" === width,
        "4/6": "w-4/6" === width,
        "5/6": "w-5/6" === width,
        "1/12": "w-1/12" === width,
        "2/12": "w-2/12" === width,
        "3/12": "w-3/12" === width,
        "4/12": "w-4/12" === width,
        "5/12": "w-5/12" === width,
        "6/12": "w-6/12" === width,
        "7/12": "w-7/12" === width,
        "8/12": "w-8/12" === width,
        "9/12": "w-9/12" === width,
        "10/12": "w-10/12" === width,
        "11/12": "w-11/12" === width,
        full: "w-full" === width,
        screen: "w-screen" === width,
        "0": "w-0" === width,
        "1": "w-1" === width,
        "2": "w-2" === width,
        "3": "w-3" === width,
        "4": "w-4" === width,
        "5": "w-5" === width,
        "6": "w-6" === width,
        "8": "w-8" === width,
        "10": "w-10" === width,
        "12": "w-12" === width,
        "16": "w-16" === width,
        "20": "w-20" === width,
        "24": "w-24" === width,
        "32": "w-32" === width,
        "40": "w-40" === width,
        "48": "w-48" === width,
        "56": "w-56" === width,
        "64": "w-64" === width
      }),
    [width]
  );
  return concatW ? `w-${measure}` : measure;
};
