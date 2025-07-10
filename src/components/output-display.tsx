"use client";

import { type FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputDisplayProps {
  id: string;
  isLoading: boolean;
  result: any;
  activeTab: string;
  targetLanguage?: string;
}

const LoadingState: FC = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-20 w-full mt-4" />
    <Skeleton className="h-8 w-1/2 mt-6" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </div>
);

const InitialState: FC = () => (
  <div className="flex items-center justify-center h-full text-muted-foreground p-6">
    Your results will appear here.
  </div>
);

export const OutputDisplay: FC<OutputDisplayProps> = ({ id, isLoading, result, activeTab, targetLanguage }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (!result) return <InitialState />;

    if (activeTab === 'convert' && result.convertedCode) {
      return (
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
      );
    }
    
    return (
      <div className="prose dark:prose-invert max-w-none p-6">
        {activeTab === 'explain' && result.explanation && (
          <>
            <h3 className="font-semibold text-lg">Explanation</h3>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.explanation}</p>
          </>
        )}
        {activeTab === 'analyze' && (
          <div className="space-y-6">
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
      </div>
    );
  };
  
  return (
    <Card id={id} className="h-[400px] lg:h-[500px] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </Card>
  );
};
