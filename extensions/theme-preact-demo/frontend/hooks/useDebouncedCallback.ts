import { useCallback, useEffect, useRef } from 'preact/hooks';

/**
 * Returns a memoised debounced version of the given callback.
 * The debounced function identity is stable (does not change across renders).
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(callback: T, delay: number): T {
  const timeoutRef = useRef<number | null>(null);
  const latestCallback = useRef(callback);

  // Keep latest callback ref up-to-date
  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        latestCallback.current(...args);
      }, delay);
    },
    [delay]
  );

  // Clear timeout on unmount
  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  // Type-safe return with proper constraint validation
  return debouncedFn as T;
}
