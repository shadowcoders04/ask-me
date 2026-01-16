// ThemeToggle.js
import React, { useEffect } from "react";

const ThemeToggle = () => {
  useEffect(() => {
    const isDarkModePreferred = localStorage.getItem("darkMode") === "true";
    const body = document.querySelector("body");
    if (isDarkModePreferred) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, []);

  const toggleMode = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark-mode");

    // Save user preference to local storage
    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
  };

  return (
    <button onClick={toggleMode}>Toggle Mode</button>
  );
};

export default ThemeToggle;
