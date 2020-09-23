import { useMemo } from "react";
import { useLocation } from "react-router";

const urlOnlyParameters = (urlString: string) => {
  const matches = urlString.match(/[^&?]*?=[^&?]*/g);
  if (!!matches) {
    return matches;
  }
  return [];
};

const splitUrlValues = (param: string): string[] => param.split("=");

const getUrlParameters = (urlString: string) => urlString.split("&");

const parameterKeyAndValue = (parameter: string): string[][] => getUrlParameters(parameter).map(splitUrlValues);

export const urlParameters = (urlString: string) => {
  const arr = urlOnlyParameters(urlString);
  if (Array.isArray(arr)) {
    return arr
      .map((parameter) => new Set(parameterKeyAndValue(parameter)))
      .reduce((acc, el) => {
        const [name, value] = el.values().next().value;
        try {
          return { ...acc, [name]: JSON.parse(value) };
        } catch (error) {
          return { ...acc, [name]: value };
        }
      }, {});
  }
  return {};
};

export const useSearch = <T = { [k: string]: string }>(): T => {
  const location = useLocation();
  const search = useMemo<T>(() => {
    const searchString = decodeURIComponent(location.search);
    return urlParameters(searchString) as T;
  }, [location.search]);
  return search;
};
