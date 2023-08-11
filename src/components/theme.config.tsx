import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export enum Themes {
  Dark = "dark",
  Light = "light",
}

type Context = [theme: Themes, setTheme: Dispatch<SetStateAction<Themes>>];

const Context = React.createContext<Context>([Themes.Dark, () => {}]);

export const ThemeProvider = (props: PropsWithChildren) => {
  const [theme, setTheme] = useState(Themes.Light);

  useEffect(() => {
    const t = window.localStorage.getItem("@blog/theme") as Themes;
    setTheme((prev) => (t ? t : prev));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("@blog/theme", theme);
  }, [theme]);

  return (
    <Context.Provider value={[theme, setTheme]}>
      {props.children}
    </Context.Provider>
  );
};

export const useTheme = () => useContext(Context);
