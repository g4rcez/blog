import { Nullable } from "../react-app-env";
import { getDefaultLanguage } from "./dom";
export const Strings = {
  formatLocaleDate: (date: string, locale?: string): string => {
    if (date === "") {
      return "";
    }
    const formatter = locale || getDefaultLanguage();
    if (formatter.toLowerCase() === "iso") {
      return new Date(date).toISOString();
    }
    return new Date(date).toLocaleString(formatter);
  },
  capitalize: (str = "") =>
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
      .join(" ")
      .replace(/(\d+)/g, " $1"),

  fromCamelCase: (str = "", separator = " ") =>
    str
      .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
      .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2"),
  nullOrEmptyString: (e?: Nullable<string>) => (e ? e === "" : true),
  uuid: () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
};
