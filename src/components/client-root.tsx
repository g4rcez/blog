"use client";
import * as amplitude from "@amplitude/analytics-browser";
import { Fragment, PropsWithChildren, useCallback, useEffect } from "react";
import { IconContext } from "react-icons";
import { Navbar } from "~/components/navbar";
import { ThemeProvider, Themes, useTheme } from "~/components/theme.config";
import { Track } from "~/components/track";
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

  const toggle = useCallback(() => {
    setTheme((p) => (p === "dark" ? Themes.Light : Themes.Dark));
  }, []);

  return (
    <Fragment>
      <Navbar toggle={toggle} theme={theme} />
      {props.children}
    </Fragment>
  );
};

export const ClientRoot = (props: PropsWithChildren) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    if (process.env.NEXT_PUBLIC_AMPLITUDE)
      amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE!);
  }, []);

  return (
    <ThemeProvider>
      <IconContext.Provider
        value={{ style: { verticalAlign: "middle", display: "inline-block" } }}
      >
        <Track event="PageView" />
        <Base>{props.children}</Base>
      </IconContext.Provider>
    </ThemeProvider>
  );
};
