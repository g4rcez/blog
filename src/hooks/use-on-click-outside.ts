import React, { useEffect } from "react";
export const useOnClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as any)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener as never);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener as never);
    };
  }, [ref, handler]);
};
