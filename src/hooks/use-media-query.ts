import { useEffect } from "react";

export const useMediaQuery = (media: string, onMatch: (matches: boolean) => void) => {
  useEffect(() => {
    const watcher = window.matchMedia(media);
    const onMatchMedia = () => onMatch(watcher.matches);
    watcher.addEventListener("change", onMatchMedia);
    return () => {
      watcher.removeEventListener("change", onMatchMedia);
    };
  }, [onMatch]);
};
