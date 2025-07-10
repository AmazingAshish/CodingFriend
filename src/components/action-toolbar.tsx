"use client";

import { Baby, Languages, Sparkles } from "lucide-react";
import type { ActiveTab } from "./code-companion";
import { LanguageSelect } from "./language-select";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ActionToolbarProps {
  activeTab: ActiveTab;
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  isEli5: boolean;
  setIsEli5: (value: boolean) => void;
  isDetecting: boolean;
}

export function ActionToolbar({
  activeTab,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  isEli5,
  setIsEli5,
  isDetecting,
}: ActionToolbarProps) {

  const renderSourceLanguageSelect = () => (
    <div className="flex items-center gap-2">
       <LanguageSelect
          value={sourceLanguage}
          onChange={setSourceLanguage}
          label="From"
        />
        <Tooltip>
            <TooltipTrigger>
              <Sparkles className={`h-4 w-4 text-muted-foreground ${isDetecting ? 'animate-spin text-primary' : ''}`} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Auto-detecting language</p>
            </TooltipContent>
          </Tooltip>
    </div>
  );

  if (activeTab === "explain") {
    return (
      <div className="flex items-center gap-4 justify-center">
        {renderSourceLanguageSelect()}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Switch
                id="eli5-mode"
                checked={isEli5}
                onCheckedChange={setIsEli5}
                aria-label="Explain Like I'm 5"
              />
              <Label htmlFor="eli5-mode">
                <Baby className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Explain Like I&apos;m 5</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  if (activeTab === "analyze") {
    return (
      <div className="flex items-center gap-2 justify-center">
        {renderSourceLanguageSelect()}
      </div>
    );
  }

  if (activeTab === "convert") {
    return (
      <div className="flex items-center gap-2 justify-center">
        {renderSourceLanguageSelect()}
        <Languages className="h-5 w-5 text-muted-foreground" />
        <LanguageSelect
          label="To"
          value={targetLanguage}
          onChange={setTargetLanguage}
        />
      </div>
    );
  }

  return null;
}
