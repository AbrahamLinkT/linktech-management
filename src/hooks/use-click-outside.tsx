// hooks/use-click-outside.ts
import { useEffect } from "react";

export const useClickOutside = (
  refs: React.RefObject<HTMLElement>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (refs.every(ref => ref.current && !ref.current.contains(event.target as Node))) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [refs, callback]);
};
