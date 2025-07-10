"use client";

import { useState, type FC } from "react";
import { Wand2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


import type { AnalyzeCodeOutput } from "@/ai/flows/analyze-code";
import { analyzeCode } from "@/ai/flows/analyze-code";
import type { ExplainCodeOutput } from "@/ai/flows/explain-code";
import { explainCode } from "@/ai/flows/explain-code";
import type { ConvertCodeOutput } from "@/ai/flows/convert-code";
import { convertCode } from "@/ai/flows/convert-code";


import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { LanguageSelect } from "./language-select";
import { OutputDisplay } from "./output-display";

type Result = ExplainCodeOutput | AnalyzeCodeOutput | ConvertCodeOutput | null;

export const CodeCompanion: FC = () => {
  const [code, setCode] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("javascript");
  const [targetLanguage, setTargetLanguage] = useState<string>("python");
  const [result, setResult] = useState<Result>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("explain");
  const { toast } = useToast();

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
        res = await explainCode({ code });
      } else if (activeTab === 'analyze') {
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

  const codeEditorStyle = {
    flex: 1,
    width: '100%',
    backgroundColor: 'hsl(var(--card))',
    borderRadius: 'var(--radius)',
    border: '1px solid hsl(var(--border))',
    padding: '1rem',
    overflow: 'auto'
  };

  return (
    <Tabs defaultValue="explain" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl">
      <Card className="w-full glassmorphism p-0 border-0">
        <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="explain">Explain Code</TabsTrigger>
            <TabsTrigger value="analyze">Analyze Code</TabsTrigger>
            <TabsTrigger value="convert">Convert Code</TabsTrigger>
          </TabsList>
          <div className="flex w-full md:w-auto items-center justify-end gap-2 md:gap-4 flex-wrap">
            {(activeTab === 'analyze' || activeTab === 'convert') && <LanguageSelect label="From" value={sourceLanguage} onChange={setSourceLanguage} />}
            {activeTab === 'convert' && <LanguageSelect label="To" value={targetLanguage} onChange={setTargetLanguage} />}
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto">
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Run"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code-input" className="text-sm font-medium">
                Your Code
              </Label>
              <div className="relative h-[400px] lg:h-[500px] flex">
                <Textarea
                  id="code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white z-10"
                />
                 <SyntaxHighlighter
                    language={sourceLanguage}
                    style={vscDarkPlus}
                    customStyle={codeEditorStyle}
                    wrapLongLines={true}
                    showLineNumbers={true}
                  >
                    {code || " "}
                  </SyntaxHighlighter>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="output" className="text-sm font-medium">
                AI Companion
              </Label>
              <OutputDisplay id="output" isLoading={isLoading} result={result} activeTab={activeTab} targetLanguage={targetLanguage} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Tabs>
  );
};
