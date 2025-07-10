"use client";

import { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <Card className="h-full flex flex-col glassmorphism">
      <CardHeader>
        <CardTitle>Your Code</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex relative p-0">
        <Textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white z-10 p-4 font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          spellCheck="false"
        />
        <div className="flex-1 w-full rounded-b-xl overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={codeEditorStyle}
            wrapLongLines={true}
            showLineNumbers={true}
            lineNumberStyle={{ opacity: 0.5, minWidth: '2.5em' }}
            className="!bg-card/70 h-full"
          >
            {code || " "}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};
