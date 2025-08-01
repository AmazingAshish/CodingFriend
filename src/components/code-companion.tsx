"use client";

import { useEffect, useState, useCallback } from "react";
import { Wand2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { AnalyzeCodeOutput } from "@/ai/flows/analyze-code";
import { analyzeCode } from "@/ai/flows/analyze-code";
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import { explainCode } from "@/ai/flows/explain-code";
import type { ConvertCodeOutput } from "@/ai/flows/convert-code";
import { convertCode } from "@/ai/flows/convert-code";
import { detectLanguage } from "@/ai/flows/detect-language";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ActionToolbar } from "./action-toolbar";
import { CodeEditor } from "./code-editor";
import { OutputDisplay } from "./output-display";
import { languages } from "./language-select";

export type Result = ExplainCodeOutput | AnalyzeCodeOutput | ConvertCodeOutput | null;
export type ActiveTab = "explain" | "solutions" | "convert";

type ResultsState = {
  [key in ActiveTab]?: Result;
};

type RequestState = {
  [key in ActiveTab]?: boolean;
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};


export const CodeCompanion = () => {
  const [code, setCode] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("javascript");
  const [targetLanguage, setTargetLanguage] = useState<string>("python");
  const [isEli5, setIsEli5] = useState<boolean>(false);

  const [results, setResults] = useState<ResultsState>({});
  const [loadingStates, setLoadingStates] = useState<RequestState>({});

  const [activeTab, setActiveTab] = useState<ActiveTab>("explain");
  const { toast } = useToast();

  const debouncedCode = useDebounce(code, 500);

  const handleLanguageDetection = useCallback(async (codeToDetect: string) => {
    if (!codeToDetect.trim()) return;

    try {
      const res = await detectLanguage({ code: codeToDetect });
      if (res.language && languages.some(l => l.value === res.language)) {
        setSourceLanguage(res.language);
      }
    } catch (error) {
      console.error("Language detection failed:", error);
    }
  }, []);

  useEffect(() => {
    if (debouncedCode) {
      handleLanguageDetection(debouncedCode);
    }
  }, [debouncedCode, handleLanguageDetection]);


  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "No code provided",
        description: "Please enter some code to get started.",
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, [activeTab]: true }));
    setResults(prev => ({ ...prev, [activeTab]: null }));

    try {
      let res: Result;
      const currentTab = activeTab;

      if (currentTab === "explain") {
        res = await explainCode({ code, isEli5, language: sourceLanguage });
      } else if (currentTab === 'solutions') {
        res = await analyzeCode({ code, language: sourceLanguage });
      } else {
        res = await convertCode({ code, sourceLanguage, targetLanguage });
      }
      
      setResults(prevResults => ({ ...prevResults, [currentTab]: res }));

    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message || "Failed to process the code. Please try again.";
      let description = "An unknown error occurred.";
      
      if (typeof errorMessage === 'string' && errorMessage.includes('503')) {
        description = "The AI model is currently overloaded. Please try again in a moment.";
      } else {
        description = "Failed to process the code. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "An error occurred",
        description,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [activeTab]: false }));
    }
  };
  
  const isLoading = !!loadingStates[activeTab];

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        <Card className="glassmorphism sticky top-[calc(var(--header-height)_+_1rem)] z-40 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-primary/10">
                  <TabsTrigger value="explain">Explain</TabsTrigger>
                  <TabsTrigger value="solutions">Solutions</TabsTrigger>
                  <TabsTrigger value="convert">Convert</TabsTrigger>
                </TabsList>
              </Tabs>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:w-auto"
                >
                  <ActionToolbar
                    activeTab={activeTab}
                    targetLanguage={targetLanguage}
                    setTargetLanguage={setTargetLanguage}
                    isEli5={isEli5}
                    setIsEli5={setIsEli5}
                  />
                </motion.div>
              </AnimatePresence>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
                size="lg"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                {isLoading ? "Processing..." : "Run"}
              </Button>
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={sourceLanguage}
          />
          <OutputDisplay
            isLoading={isLoading}
            result={results[activeTab] || null}
            activeTab={activeTab}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
