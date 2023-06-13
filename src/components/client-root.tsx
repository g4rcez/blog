"use client";
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Navbar } from "~/components/navbar";
import { ThemeProvider, Themes, useTheme } from "~/components/theme.config";
import { IconContext } from "react-icons";
import { ThemePreference } from "~/lib/theme-preference";
import Dark from "../styles/dark.json";
import Light from "../styles/light.json";

const Base = (props: PropsWithChildren) => {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const json = theme === "dark" ? Dark : Light;
    ThemePreference.setCss(json, root);
    ThemePreference.saveTheme(theme);
    root.classList.value = theme;
  }, [theme]);

  const themeColor = useMemo(
    () => (theme === "dark" ? Dark.primary.DEFAULT : Light.primary.DEFAULT),
    []
  );

  const toggle = useCallback(() => {
    setTheme((p) => (p === "dark" ? Themes.Light : Themes.Dark));
  }, []);
  return (
    <Fragment>
      <Navbar toggle={toggle} theme={themeColor} />
      {props.children}
    </Fragment>
  );
};

export const ClientRoot = (props: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <IconContext.Provider
        value={{ style: { verticalAlign: "middle", display: "inline-block" } }}
      >
        <Base>{props.children}</Base>
      </IconContext.Provider>
    </ThemeProvider>
  );
};
