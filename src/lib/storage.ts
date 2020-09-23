import { LocalStorage } from "storage-manager-js";

const LOCALE_KEY = "LOCALE_KEY";

const getStorageLocale = () => LocalStorage.get(LOCALE_KEY);

export const Storage = {
  getStorageLocale,
};
