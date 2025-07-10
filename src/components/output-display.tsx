"use client";

import { type FC, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, Clipboard } from 'lucide-react';

import type { ActiveTab, Result } from './code-companion';

interface OutputDisplayProps {
  isLoading: boolean;
  result: Result;
  activeTab: ActiveTab;
  targetLanguage?: string;
}

const LoadingState: FC = () => (
  <div className="p-6 h-full">
    <div className="space-y-4 shimmer h-full">
      <Skeleton className="h-8 w-1/3 bg-muted/50" />
      <Skeleton className="h-4 w-full bg-muted/50" />
      <Skeleton className="h-4 w-4/5 bg-muted/50" />
      <Skeleton className="h-20 w-full mt-4 bg-muted/50" />
      <Skeleton className="h-8 w-1/2 mt-6 bg-muted/50" />
      <Skeleton className="h-4 w-full bg-muted/50" />
      <Skeleton className="h-4 w-full bg-muted/50" />
    </div>
  </div>
);

const InitialState: FC = () => (
  <div className="flex items-center justify-center h-full text-muted-foreground p-6">
    Your AI-generated results will appear here.
  </div>
);


const MarkdownRenderer = ({ content, activeTab }: { content: string; activeTab: ActiveTab }) => {
  const renderSection = (sectionContent: string, sectionIndex: number) => {
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts = sectionContent.split(codeBlockRegex);

    const colors = ['border-blue-400', 'border-purple-400', 'border-teal-400'];
    const hrColor = colors[sectionIndex % colors.length];

    return (
      <div key={`section-${sectionIndex}`}>
         {sectionIndex > 0 && <hr className={`my-6 border-t-2 ${hrColor}`} />}
        {parts.map((part, index) => {
          if (index % 3 === 2) { // This is the code content
            const language = parts[index-1] || 'bash';
            return (
              <div key={index} className="not-prose my-4 rounded-md bg-card/70 border overflow-hidden">
                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  customStyle={{ backgroundColor: 'transparent', padding: '1rem', margin: 0 }}
                  showLineNumbers
                  className="!bg-transparent"
                >
                  {part.trim()}
                </SyntaxHighlighter>
              </div>
            );
          }
          if (index % 3 === 0) { // This is the markdown text
              let html = part
              .replace(/^### (.*$)/gim, '<h3 class="font-semibold text-lg !mt-4">$1</h3>')
              .replace(/^## (.*$)/gim, '<h2 class="font-semibold text-xl !mt-6">$1</h2>')
              .replace(/^# (.*$)/gim, '<h1 class="font-bold text-2xl !mt-8">$1</h1>')
              .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*)\*/g, '<em>$1</em>')
              .replace(/`([^`]+)`/g, '<code class="inline-code text-sm font-mono bg-muted/50 dark:bg-muted/30 text-accent-foreground p-1 rounded-sm">$1</code>')
              .replace(/^\s*[-*] (.*)/gm, '<li class="my-1">$1</li>')
              .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
              .replace(/^\s*\d+\. (.*)/gm, '<li class="my-1">$1</li>')
              .replace(/(<li.*<\/li>)/gs, (match, p1) => {
                  if (match.includes('<ol>') || match.includes('<ul>')) return match;
                  return /^\s*\d+\./.test(content) ? `<ol>${p1}</ol>` : `<ul>${p1}</ul>`;
              });
            return <div key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          }
          return null; 
        })}
      </div>
    )
  }

  const sections = activeTab === 'solutions' ? content.split(/\n---\n/) : [content];

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none p-6 text-foreground/80 whitespace-pre-wrap leading-relaxed">
      {sections.map(renderSection)}
    </div>
  );
};


const ContentDisplay: FC<Omit<OutputDisplayProps, 'isLoading'>> = ({ result, activeTab, targetLanguage }) => {
  if (!result) return <InitialState />;

  let contentToDisplay = "";
  if ('convertedCode' in result) contentToDisplay = result.convertedCode;
  else if ('explanation' in result) contentToDisplay = result.explanation;
  else if ('analysis' in result) contentToDisplay = result.analysis;
  
  const key = contentToDisplay;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full relative"
      >
        {activeTab === 'convert' && 'convertedCode' in result && result.convertedCode && (
          <div className="h-full">
            <SyntaxHighlighter
              language={targetLanguage}
              style={oneDark}
              customStyle={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                padding: '1rem',
                fontSize: '14px',
              }}
              wrapLongLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ opacity: 0.5, minWidth: '2.5em' }}
              className="!bg-card/70 h-full"
            >
              {result.convertedCode}
            </SyntaxHighlighter>
          </div>
        )}

        {(activeTab === 'explain' || activeTab === 'solutions') && (
          <MarkdownRenderer 
            content={'explanation' in result ? result.explanation : 'analysis' in result ? result.analysis : ""}
            activeTab={activeTab} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export const OutputDisplay: FC<OutputDisplayProps> = ({ isLoading, result, activeTab, targetLanguage }) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const getTitle = () => {
    if (!result && !isLoading) return "Output";
    if (isLoading) return "Processing...";
    switch(activeTab) {
      case 'explain': return "Explanation";
      case 'solutions': return "Solutions";
      case 'convert': return `Converted to ${targetLanguage?.charAt(0).toUpperCase()}${targetLanguage?.slice(1)}`;
      default: return "Output";
    }
  }

  const getCopyContent = () => {
    if (!result) return "";
    if ('convertedCode' in result) return result.convertedCode;
    if ('explanation' in result) return result.explanation;
    if ('analysis' in result) return result.analysis;
    return "";
  }
  
  const handleCopy = () => {
    const content = getCopyContent();
    if (content) {
      navigator.clipboard.writeText(content);
      setHasCopied(true);
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden glassmorphism">
       <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/20">
        <CardTitle className="text-base">{getTitle()}</CardTitle>
        {result && !isLoading && (
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-muted-foreground">
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {isLoading ? <LoadingState /> : <ContentDisplay result={result} activeTab={activeTab} targetLanguage={targetLanguage} />}
      </CardContent>
    </Card>
  );
};
