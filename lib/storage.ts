"use client";

import { useEffect, useState } from "react";

const PREFIX = "life-dashboard:";

/**
 * useState that persists to localStorage. Data stays in this browser only.
 * Reads happen after mount so server and client render the same markup.
 */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // storage unavailable or corrupt: keep the initial value
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // storage full or blocked: the app still works for this visit
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}
