// src/components/DarkMode/DarkMode.js
import React from "react";
import Toggle from "react-toggle";
import { useColorScheme } from '../../hooks/useColorScheme';
import styles from "./DarkMode.module.css"; // Import the CSS Module
// src/components/DarkMode/DarkMode.js
import "react-toggle/style.css"; // Import the default styles for the toggle button


export const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();
  return (
    <Toggle
      className={styles.toggle}
      checked={isDark}
      onChange={({ target }) => setIsDark(target.checked)}
      icons={{
        checked: <span className={`${styles.trackIcon} ${styles.trackIconChecked}`}>🌙</span>,
        unchecked: <span className={`${styles.trackIcon} ${styles.trackIconUnchecked}`}>🔆</span>,
      }}
      aria-label="Dark mode toggle"
    />
  );
};
