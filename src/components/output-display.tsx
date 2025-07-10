"use client";

import { type FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface OutputDisplayProps {
  id: string;
  isLoading: boolean;
  result: any;
  activeTab: string;
}

const LoadingState: FC = () => (
  <div className="space-y-4">
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
  <div className="flex items-center justify-center h-full text-muted-foreground">
    Your results will appear here.
  </div>
);

export const OutputDisplay: FC<OutputDisplayProps> = ({ id, isLoading, result, activeTab }) => {
  return (
    <Card id={id} className="h-[400px] lg:h-[500px] flex flex-col">
      <CardContent className="p-6 flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : !result ? (
          <InitialState />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
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
        )}
      </CardContent>
    </Card>
  );
};
