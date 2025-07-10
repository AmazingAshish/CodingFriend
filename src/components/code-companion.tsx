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

  const [result, setResult] = useState<Result>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("explain");
  const { toast } = useToast();

  const debouncedCode = useDebounce(code, 500);

  const handleLanguageDetection = useCallback(async (codeToDetect: string) => {
    if (!codeToDetect.trim()) return;

    setIsDetecting(true);
    try {
      const res = await detectLanguage({ code: codeToDetect });
      if (res.language && languages.some(l => l.value === res.language)) {
        setSourceLanguage(res.language);
      }
    } catch (error) {
      console.error("Language detection failed:", error);
    } finally {
      setIsDetecting(false);
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

    setIsLoading(true);
    setResult(null);

    try {
      let res: Result;
      if (activeTab === "explain") {
        res = await explainCode({ code, isEli5, language: sourceLanguage });
      } else if (activeTab === 'solutions') {
        res = await analyzeCode({ code, language: sourceLanguage });
      } else {
        res = await convertCode({ code, sourceLanguage, targetLanguage });
      }
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to process the code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                    sourceLanguage={sourceLanguage}
                    setSourceLanguage={setSourceLanguage}
                    targetLanguage={targetLanguage}
                    setTargetLanguage={setTargetLanguage}
                    isEli5={isEli5}
                    setIsEli5={setIsEli5}
                    isDetecting={isDetecting}
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
            result={result}
            activeTab={activeTab}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
