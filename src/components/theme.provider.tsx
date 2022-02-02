import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useFetcher } from "remix";
import { useMediaQuery } from "~/hooks/use-media-query";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";
import { Themes } from "~/lib/theme";

type ContextType = [theme: Themes, setTheme: React.Dispatch<React.SetStateAction<Themes>>];

const Context = React.createContext<ContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ initialTheme: Themes }> = ({ children, initialTheme }) => {
  const [theme, setTheme] = useState(initialTheme);
  const { submit } = useFetcher();
  const onMediaMatch = useCallback((match: boolean) => setTheme(match ? Themes.Light : Themes.Dark), []);
  useMediaQuery("(prefers-color-scheme: light)", onMediaMatch);
  const colorSchemaMeta = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    if (colorSchemaMeta.current === null) {
      colorSchemaMeta.current = document.querySelector("meta[name='color-scheme']");
    }
    colorSchemaMeta.current!.content = theme === Themes.Dark ? "dark light" : "light dark";

    if (theme === Themes.Null) return;
    submit({ theme }, { action: Links.postApiTheme, method: Http.Post });
  }, [theme, submit]);

  return <Context.Provider value={[theme, setTheme]}>{children}</Context.Provider>;
};

export const useTheme = () => useContext(Context)!;
