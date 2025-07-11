"use client";

import { FC, useState, useRef, useLayoutEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from './ui/button';
import { Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

export const CodeEditor: FC<CodeEditorProps> = ({ code, setCode, language }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [code]);

  const getFileExtension = (lang: string) => {
    const map: { [key: string]: string } = {
        javascript: '.js',
        python: '.py',
        java: '.java',
        csharp: '.cs',
        typescript: '.ts',
        go: '.go',
        rust: '.rs',
        php: '.php',
        cpp: '.cpp',
        c: '.c',
        ruby: '.rb',
        swift: '.swift',
        kotlin: '.kt',
        scala: '.scala',
        r: '.R',
        dart: '.dart',
        elixir: '.ex',
        haskell: '.hs',
        perl: '.pl',
        sql: '.sql',
    };
    return map[lang] || '.txt';
  }

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } else {
      toast({
        variant: "destructive",
        title: "Nothing to copy",
        description: "The code editor is empty.",
      });
    }
  };


  return (
    <Card className="flex flex-col glassmorphism overflow-hidden min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/20">
        <CardTitle className="text-sm font-mono text-muted-foreground">{`${language}${getFileExtension(language)}`}</CardTitle>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-muted-foreground" aria-label="Copy code">
                        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>{hasCopied ? 'Copied!' : 'Copy code'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-1 flex relative p-0">
        <Textarea
          ref={textareaRef}
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          spellCheck="false"
          aria-label="Code editor input area"
          className="w-full min-h-[120px] resize-none p-4 font-mono text-sm leading-relaxed bg-card/70 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 code-editor-textarea"
        />
      </CardContent>
    </Card>
  );
};
