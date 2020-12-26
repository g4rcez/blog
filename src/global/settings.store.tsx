import { pipe } from "ramda";
import React, { createContext, useCallback, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import useReducer from "use-typed-reducer";
import { getDefaultLanguage } from "../lib/dom";
import { merge } from "../lib/object";
import { Storage } from "../lib/storage";
import { Strings } from "../lib/strings";
import { Links } from "../routes/links";
import DarkTheme from "../styles/colors/colors.json";
import LightTheme from "../styles/colors/light.json";
import { setAllColors } from "../styles/set-colors";
import { Config } from "./config";
import { GithubRepository, GithubUser } from "./github.types";
import { useGitCache } from "./git-user-cache";

const mergeAndSet = pipe(merge, setAllColors);

const checkSkeleton = <T,>(b: T, n: T): T => {
  const structure: T = {} as never;
  for (const i in b) {
    const base = (b as any)[i];
    const newOne = (n as any)[i];
    if (typeof base === "object" && n !== undefined && typeof newOne === "object") {
      structure[i] = checkSkeleton(base, newOne ?? base);
    } else {
      structure[i] = newOne ?? base;
    }
  }
  return structure;
};

const defaultState = {
  locale: getDefaultLanguage(),
  colors: mergeAndSet(checkSkeleton(DarkTheme, Storage.getStorageColors()), Storage.getStorageColors()),
  user: null as GithubUser | null,
  repositories: [] as GithubRepository[]
};

type State = typeof defaultState;

const reducers = {
  setColors: (c: typeof DarkTheme) => (state: State): State => ({
    ...state,
    colors: Storage.setStorageColors(setAllColors(c))
  }),
  setLocale: (locale: string) => (state: State): State => ({ ...state, locale }),
  setUser: (user: GithubUser) => (state: State): State => ({ ...state, user }),
  setRepositories: (repositories: GithubRepository[]) => (state: State): State => ({ ...state, repositories })
};
export const SettingsStore = createContext({
  state: defaultState,
  dispatch: reducers
});

export const Settings: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(defaultState, reducers);
  const location = useLocation();
  const userCache = useGitCache();

  useEffect(() => {
    const req = userCache?.request!;
    const userRequest = async () => {
      const response = await req(`https://api.github.com/users/${Config.github}`);
      const user: GithubUser = await response.json();
      dispatch.setUser(user);
      await repositoriesRequest(user.login, user.public_repos);
    };
    const repositoriesRequest = async (user: string, repoCount: number) => {
      const url = `https://api.github.com/users/${user}/repos?per_page=${repoCount}`;
      const response = await fetch(url);
      const repos: GithubRepository[] = await response.json();
      dispatch.setRepositories(repos.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
    };
    if (location.pathname === Links.me && userCache !== null) {
      userRequest();
    }
  }, [location, userCache]);

  return <SettingsStore.Provider children={children} value={{ state, dispatch }} />;
};

export const useFormatLocaleDate = () => {
  const settings = useContext(SettingsStore);
  return useCallback((date: string) => Strings.formatLocaleDate(date, settings.state.locale), [settings.state.locale]);
};

export const useColors = () => {
  const settings = useContext(SettingsStore);
  return settings.state.colors;
};

export const useGitUser = () => {
  const settings = useContext(SettingsStore);
  return settings.state.user;
};
export const useRepositories = () => {
  const settings = useContext(SettingsStore);
  return settings.state.repositories;
};

export const useSortRepositories = (sorter: (a: GithubRepository, b: GithubRepository) => number) => {
  const settings = useContext(SettingsStore);
  return () => settings.dispatch.setRepositories(settings.state.repositories.sort(sorter));
};

export const useDarkMode = () => {
  const context = useContext(SettingsStore);
  return () => context.dispatch.setColors(DarkTheme);
};

export const useLightMode = () => {
  const context = useContext(SettingsStore);
  return () => context.dispatch.setColors(LightTheme);
};
