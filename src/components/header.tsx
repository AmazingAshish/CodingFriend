import { Code } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ '--header-height': '56px' } as React.CSSProperties}>
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">
            <span className="text-primary">Code</span>Leap
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
