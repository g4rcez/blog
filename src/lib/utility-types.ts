export type Nullable<T> = T | null;

export type OmitKeys<T, K extends keyof T> = Omit<T, K>;

export const has = <T extends {}, K extends keyof T>(obj: T, key: K) => Object.prototype.hasOwnProperty.call(obj, key);
