import { ThemePreference } from "lib/theme-preference";
import Dark from "styles/dark.json";
import Light from "styles/light.json";

import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  useCallback,
  useContext,
} from "react";

const Context = createContext({
  toggle: () => {},
  themeColor: "dark",
  theme: {
    name: "dark",
    json: Dark,
  },
});

export const ThemeProvider: React.FC = (props) => {
  const [theme, setTheme] = useState(() => ({
    name: "dark",
    json: Dark,
  }));

  useEffect(() => {
    setTheme(() =>
      ThemePreference.prefersDark()
        ? { name: "dark", json: Dark }
        : { name: "light", json: Light }
    );
  }, []);

  useEffect(() => {
    if (theme === null) return;
    const root = document.documentElement;
    const json = theme.name === "dark" ? Dark : Light;
    ThemePreference.setCss(json, root);
    ThemePreference.saveTheme(theme.name as never);
    root.classList.value = theme.name;
  }, [theme]);

  const themeColor = useMemo(
    () =>
      theme.name === "dark" ? Dark.primary.DEFAULT : Light.primary.DEFAULT,
    []
  );

  const toggle = useCallback(() => {
    setTheme((p) =>
      p.name === "dark"
        ? { name: "light", json: Light }
        : { name: "dark", json: Dark }
    );
  }, []);

  return (
    <Context.Provider
      value={{ toggle, themeColor, theme }}
      children={props.children}
    />
  );
};

export const useDarkMode = () => useContext(Context);
