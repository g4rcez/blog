import { LocalStorage } from "storage-manager-js";

const LOCALE_KEY = "LOCALE_KEY";
const COLORS_KEY = "COLORS_KEY";

const getStorageLocale = () => LocalStorage.get(LOCALE_KEY);

const getStorageColors = () => LocalStorage.get(COLORS_KEY);
const setStorageColors = <T>(o: T) => (LocalStorage.set(COLORS_KEY, o), o)

export const Storage = {
  getStorageLocale, getStorageColors, setStorageColors
};
