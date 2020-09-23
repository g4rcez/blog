import { Storage } from "./storage";
export const getDefaultLanguage = (): string => Storage.getStorageLocale() || navigator.language;
