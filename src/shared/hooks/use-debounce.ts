import { i } from "framer-motion/client";
import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a debounced version of the callback that fires after `delay` ms.
 * Safe to use with inline functions — the latest callback is always used.
 * Automatically cancelled on unmount.
 *
 * @example
 * const search = useDebounceCallback((query: string) => fetchResults(query), 300);
 *
 * <input onChange={(e) => search(e.target.value)} />
 *
 * // Cancel a pending call manually:
 * search.cancel();
 */

interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  cancel: () => void;
}

export function useDebounceCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => cancel, [cancel]);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, cancel]
  ) as DebouncedFunction<Args>;

  debounced.cancel = cancel;
  return debounced;
}