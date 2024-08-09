// src/hooks/useColorScheme.js
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import useLocalStorageState from "use-local-storage-state";

export function useColorScheme() {
  const systemPrefersDark = useMediaQuery(
    {
      query: "(prefers-color-scheme: dark)",
    },
    undefined
  );

  const [isDark, setIsDark] = useLocalStorageState("colorScheme");
  const value = useMemo(
    () => (isDark === undefined ? !!systemPrefersDark : isDark),
    [isDark, systemPrefersDark]
  );

  useEffect(() => {
    if (value) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [value]);

  return {
    isDark: value,
    setIsDark,
  };
}
