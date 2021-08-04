import { LocalStorage } from "storage-manager-js";

const getTheme = () => LocalStorage.get("@theme");

const saveTheme = (theme: "dark" | "light") =>
  LocalStorage.set("@theme", theme);

const prefersDark = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const setColor = (varName: string, color: string, root: HTMLElement) =>
  root.style.setProperty(varName, color);

const Entries = <T, K extends string>(v: T): Array<[keyof T, K]> =>
  Object.entries(v) as never;

const setCssVars = (colors: any, element: HTMLElement) => {
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === "string") {
      setColor(`--${key}`, value, element);
    } else if (typeof value === "object") {
      Entries(value).forEach(([secKey, secVal]) => {
        setColor(`--${key}-${secKey}`, secVal, element);
      });
    }
  });
  return colors;
};

export const ThemePreference = {
  setCss: setCssVars,
  getTheme,
  saveTheme,
  prefersDark: () => getTheme() === "dark" || prefersDark(),
};
