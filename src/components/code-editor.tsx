"use client";

import { FC, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from './ui/button';
import { Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

const codeEditorStyle = {
  margin: 0,
  padding: '1rem',
  backgroundColor: 'transparent',
  flex: 1,
  height: '100%',
  width: '100%',
  overflow: 'auto',
  fontSize: '14px',
  lineHeight: '1.6',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
};

export const CodeEditor: FC<CodeEditorProps> = ({ code, setCode, language }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

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
    <Card className="h-full flex flex-col glassmorphism overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/20">
        <CardTitle className="text-sm font-mono text-muted-foreground">{`${language}${getFileExtension(language)}`}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-muted-foreground" aria-label="Copy code">
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex relative p-0">
        <Textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="code-editor-textarea absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white z-10 p-4 font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          spellCheck="false"
          style={{ lineHeight: '1.6', fontSize: '14px' }}
        />
        <div className="flex-1 w-full rounded-b-xl overflow-auto">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={codeEditorStyle}
            wrapLongLines={true}
            showLineNumbers={true}
            lineNumberStyle={{ opacity: 0.5, minWidth: '2.5em', userSelect: 'none' }}
            className="!bg-card/70 h-full"
          >
            {code || " "}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};
