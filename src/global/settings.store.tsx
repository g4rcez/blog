import React, { createContext, useCallback, useContext, useEffect } from "react";
import useReducer from "use-typed-reducer";
import { getDefaultLanguage } from "../lib/dom";
import { Strings } from "../lib/strings";
import Colors from "../styles/colors/colors.json";
import { setAllColors } from "../styles/set-colors";
import { Config } from "./config";
import { GithubRepository, GithubUser } from "./github.types";

const defaultState = {
  locale: getDefaultLanguage(),
  colors: Colors,
  user: null as GithubUser | null,
  repositories: [] as GithubRepository[]
};

type State = typeof defaultState;

const reducers = {
  setColors: (c: typeof Colors) => (state: State): State => ({ ...state, colors: setAllColors(c) }),
  setUser: (user: GithubUser) => (state: State): State => ({ ...state, user }),
  setRepositories: (repositories: GithubRepository[]) => (state: State): State => ({ ...state, repositories })
};
export const SettingsStore = createContext({
  state: defaultState,
  dispatch: reducers
});

export const Settings: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(defaultState, reducers);

  useEffect(() => {
    const userRequest = async () => {
      const response = await fetch(`https://api.github.com/users/${Config.github}`, { cache: "force-cache" });
      const user: GithubUser = await response.json();
      dispatch.setUser(user);
      repositoriesRequest(user.login, user.public_repos);
    };
    const repositoriesRequest = async (user: string, repoCount: number) => {
      const url = `https://api.github.com/users/${user}/repos?per_page=${repoCount}`;
      const response = await fetch(url, { cache: "no-cache" });
      const repos: GithubRepository[] = await response.json();
      dispatch.setRepositories(repos.sort((a, b) => a.name.localeCompare(b.name)));
    };
    userRequest();
  }, []);

  useEffect(() => {
    dispatch.setColors(Colors);
  }, [state.colors]);

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
