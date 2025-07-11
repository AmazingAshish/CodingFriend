"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function ThemeToggle() {
  // Initialize state from localStorage or default to 'dark'
  const [theme, setTheme] = useState<string>('dark');

  useEffect(() => {
    // This effect runs once on mount to set the theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Default to dark mode if no theme is stored
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? 
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all" /> : 
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
