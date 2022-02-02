import { useEffect } from "react";

type Effect = Parameters<typeof useEffect>[0];

export const useOnce = (effect: Effect) => {
  useEffect(() => {
    effect();
  }, []);
};
