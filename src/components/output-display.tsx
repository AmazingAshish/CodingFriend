"use client";

import { type FC } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AnimatePresence, motion } from 'framer-motion';

import type { ActiveTab, Result } from './code-companion';

interface OutputDisplayProps {
  isLoading: boolean;
  result: Result;
  activeTab: ActiveTab;
  targetLanguage?: string;
}

const LoadingState: FC = () => (
  <div className="space-y-4 p-6 shimmer h-full">
    <Skeleton className="h-8 w-1/3 bg-muted/50" />
    <Skeleton className="h-4 w-full bg-muted/50" />
    <Skeleton className="h-4 w-4/5 bg-muted/50" />
    <Skeleton className="h-20 w-full mt-4 bg-muted/50" />
    <Skeleton className="h-8 w-1/2 mt-6 bg-muted/50" />
    <Skeleton className="h-4 w-full bg-muted/50" />
    <Skeleton className="h-4 w-full bg-muted/50" />
  </div>
);

const InitialState: FC = () => (
  <div className="flex items-center justify-center h-full text-muted-foreground p-6">
    Your AI-generated results will appear here.
  </div>
);

const ContentDisplay: FC<Omit<OutputDisplayProps, 'isLoading'>> = ({ result, activeTab, targetLanguage }) => {
  if (!result) return <InitialState />;

  const key = result ? ('convertedCode' in result ? result.convertedCode : 'explanation' in result ? result.explanation : result.complexityAnalysis) : 'initial';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {activeTab === 'convert' && 'convertedCode' in result && result.convertedCode && (
          <SyntaxHighlighter
            language={targetLanguage}
            style={vscDarkPlus}
            customStyle={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              padding: '1rem',
            }}
            wrapLongLines={true}
            showLineNumbers={true}
          >
            {result.convertedCode}
          </SyntaxHighlighter>
        )}

        {activeTab === 'explain' && 'explanation' in result && result.explanation && (
          <div className="prose dark:prose-invert max-w-none p-6">
            <h3 className="font-semibold text-lg">Explanation</h3>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.explanation}</p>
          </div>
        )}

        {activeTab === 'analyze' && 'complexityAnalysis' in result && (
          <div className="prose dark:prose-invert max-w-none p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Complexity Analysis</h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.complexityAnalysis}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Vulnerability Analysis</h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.vulnerabilityAnalysis}</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};


export const OutputDisplay: FC<OutputDisplayProps> = ({ isLoading, result, activeTab, targetLanguage }) => {
  return (
    <Card className="h-[400px] lg:h-[600px] flex flex-col overflow-hidden glassmorphism">
      <div className="flex-1 overflow-y-auto">
        {isLoading ? <LoadingState /> : <ContentDisplay result={result} activeTab={activeTab} targetLanguage={targetLanguage} />}
      </div>
    </Card>
  );
};
