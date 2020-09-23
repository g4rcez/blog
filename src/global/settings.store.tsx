import React, { createContext, useCallback, useContext, useEffect } from "react";
import useReducer from "use-typed-reducer";
import { getDefaultLanguage } from "../lib/dom";
import { Strings } from "../lib/strings";
import Colors from "../styles/colors/colors.json";
import { setAllColors } from "../styles/set-colors";

const defaultState = {
  locale: getDefaultLanguage(),
  colors: Colors
};

type State = typeof defaultState;

const reducers = {
  setColors: (c: typeof Colors) => (state: State): State => ({ ...state, colors: setAllColors(c) })
};
export const SettingsStore = createContext({
  state: defaultState,
  dispatch: reducers
});

export const Settings: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(defaultState, reducers);

  useEffect(() => {
    dispatch.setColors(Colors);
  }, [state.colors]);

  return <SettingsStore.Provider children={children} value={{ state, dispatch }} />;
};

export const useFormatLocaleDate = () => {
  const settings = useContext(SettingsStore);
  return useCallback((date: Date) => Strings.formatLocaleDate(date, settings.state.locale), [settings.state.locale]);
};

export const useColors = () => {
  const settings = useContext(SettingsStore);
  return settings.state.colors;
};
