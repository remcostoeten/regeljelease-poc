import { useEffect, useRef } from "react";

export function useDebounceCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Clean up on unmount
  useEffect(() => cancel, []);

  const debounced = (...args: Args) => {
    cancel();
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  debounced.cancel = cancel;

  return debounced;
}
