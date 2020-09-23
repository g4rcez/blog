import Colors from "./colors/colors.json";

const root: HTMLElement = document.querySelector(":root") as any;

const setColor = (varName: string, color: string) => root.style.setProperty(varName, color);

export const setAllColors = (c: typeof Colors) => {
  Object.entries(c).forEach(([key, value]) => {
    if (typeof value === "string") {
      setColor(`${key}`, value);
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([secKey, secVal]) => {
        setColor(`--${key}-${secKey}`, secVal);
      });
    }
  });
  return c;
};
