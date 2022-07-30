import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { useMediaQuery } from "~/hooks/use-media-query";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";
import { Themes } from "~/lib/theme";

type ContextType = [
  theme: Themes,
  setTheme: React.Dispatch<React.SetStateAction<Themes>>
];

const Context = React.createContext<ContextType | undefined>(undefined);

const mediaQuery = "(prefers-color-scheme: dark)";

export const ThemeProvider = ({
  children,
  initialTheme,
}: React.PropsWithChildren<{ initialTheme: Themes }>) => {
  const [theme, setTheme] = useState(initialTheme);
  const { submit } = useFetcher();
  const onMediaMatch = useCallback(
    (match: boolean) => setTheme(match ? Themes.Dark : Themes.Light),
    []
  );
  useMediaQuery(mediaQuery, onMediaMatch);

  useEffect(() => {
    setTheme(theme);
    submit({ theme }, { action: Links.postApiTheme, method: Http.Post });
  }, [theme, submit]);

  return (
    <Context.Provider value={[theme, setTheme]}>{children}</Context.Provider>
  );
};

export const useTheme = () => useContext(Context)!;
