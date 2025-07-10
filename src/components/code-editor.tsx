"use client";

import { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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
  lineHeight: '1.5',
};

export const CodeEditor: FC<CodeEditorProps> = ({ code, setCode, language }) => {
  return (
    <Card className="h-full min-h-[400px] lg:h-[600px] flex flex-col glassmorphism">
      <CardHeader>
        <CardTitle>Your Code</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex relative p-0">
        <Textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white z-10 p-4 font-mono text-sm leading-relaxed"
          spellCheck="false"
        />
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={codeEditorStyle}
          wrapLongLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ opacity: 0.5, minWidth: '2.5em' }}
          className="!bg-card/70 flex-1 w-full rounded-b-lg"
        >
          {code || " "}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
};
