"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Initialize state from localStorage or default to 'light'
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    // This effect runs once on mount to set the theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);


  useEffect(() => {
    // This effect runs whenever the theme state changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);
  

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  // Render a placeholder on the server and during initial client render
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <Button variant="ghost" size="icon" className="h-9 w-9" disabled><Sun className="h-[1.2rem] w-[1.2rem]"/></Button>;
  }


  return (
    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? 
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" /> : 
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      }
    </Button>
  );
}
