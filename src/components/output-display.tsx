"use client";

import React, { type FC, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Check, 
  Clipboard, 
  Download, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Code2,
  FileText,
  Lightbulb,
  Zap
} from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ActiveTab, Result } from './code-companion';

interface OutputDisplayProps {
  isLoading: boolean;
  result: Result;
  activeTab: ActiveTab;
  targetLanguage?: string;
  onRefresh?: () => void;
  className?: string;
}

interface SearchState {
  query: string;
  matches: number[];
  currentMatch: number;
  isSearchOpen: boolean;
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },
  content: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.1 }
    }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }
};

const LoadingState: FC = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 95 ? 95 : prev + Math.random() * 15);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="p-6 h-full space-y-6"
      variants={ANIMATION_VARIANTS.stagger}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-4">
        <motion.div variants={ANIMATION_VARIANTS.item}>
          <Skeleton className="h-8 w-1/3 bg-gradient-to-r from-muted/30 to-muted/60 animate-pulse" />
        </motion.div>
        
        <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Processing your request...
          </div>
        </motion.div>
        
        <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-3">
          <Skeleton className="h-4 w-full bg-gradient-to-r from-muted/20 to-muted/40 animate-pulse" />
          <Skeleton className="h-4 w-4/5 bg-gradient-to-r from-muted/40 to-muted/20 animate-pulse" />
          <Skeleton className="h-20 w-full bg-gradient-to-r from-muted/30 to-muted/50 animate-pulse rounded-lg" />
        </motion.div>
        
        <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-3">
          <Skeleton className="h-8 w-1/2 bg-gradient-to-r from-muted/40 to-muted/60 animate-pulse" />
          <Skeleton className="h-4 w-full bg-gradient-to-r from-muted/20 to-muted/40 animate-pulse" />
          <Skeleton className="h-4 w-full bg-gradient-to-r from-muted/30 to-muted/50 animate-pulse" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const InitialState: FC = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 space-y-4"
    variants={ANIMATION_VARIANTS.content}
    initial="hidden"
    animate="visible"
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
      <Zap className="h-8 w-8 text-primary/60" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="font-medium text-foreground">Ready to Generate</h3>
      <p className="text-sm">Your AI-generated results will appear here</p>
    </div>
  </motion.div>
);

const EnhancedMarkdownRenderer = ({ 
  content, 
  activeTab, 
  searchState, 
  isDarkMode 
}: { 
  content: string; 
  activeTab: ActiveTab;
  searchState: SearchState;
  isDarkMode: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const highlightSearchTerms = useCallback((text: string) => {
    if (!searchState.query) return text;
    
    const regex = new RegExp(`(${searchState.query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded">$1</mark>');
  }, [searchState.query]);

  const renderTable = useCallback((tableMarkdown: string, highlightFn: (text: string) => string) => {
    const lines = tableMarkdown.trim().split('\n');
    if (lines.length < 2) return null;

    const header = lines[0].split('|').map(s => s.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line => line.split('|').map(s => s.trim()).filter(Boolean));

    return (
      <div className="not-prose my-6 overflow-hidden rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {header.map((head, i) => (
                  <th key={i} className="p-3 text-left font-semibold text-foreground"
                    dangerouslySetInnerHTML={{ __html: highlightFn(head.replace(/`/g, '')) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors duration-150">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3"
                      dangerouslySetInnerHTML={{
                        __html: highlightFn(cell.replace(/`([^`]+)`/g,
                          '<code class="inline-code text-sm font-mono bg-muted/60 dark:bg-muted/40 text-accent-foreground px-1.5 py-0.5 rounded-md">$1</code>'
                        ))
                      }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }, []);

  const parseMarkdown = useCallback((markdown: string) => {
    const parts = markdown.split(/(```(?:\w+)?\n[\s\S]*?\n```|\|(?:[^\n\r|]*\|)+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeBlockMatch = part.match(/```(\w+)?\n([\s\S]*?)\n```/);
        if (!codeBlockMatch) return <div key={index}>{part}</div>;

        const language = codeBlockMatch[1] || 'text';
        const code = codeBlockMatch[2].trim();
        return (
          <motion.div 
            key={`code-${index}`} 
            className="not-prose my-6 rounded-lg bg-card/70 border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            variants={ANIMATION_VARIANTS.item}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-muted/30">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground capitalize">{language}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {code.split('\n').length} lines
              </Badge>
            </div>
            <SyntaxHighlighter 
              language={language} 
              style={isDarkMode ? oneDark : oneLight}
              customStyle={{ backgroundColor: 'transparent', padding: '1rem', margin: 0, fontSize: '14px', lineHeight: '1.5' }}
              showLineNumbers
              wrapLongLines
              className="!bg-transparent"
            >
              {code}
            </SyntaxHighlighter>
          </motion.div>
        );
      }
      
      if (part.startsWith('|')) {
        return <div key={index}>{renderTable(part, highlightSearchTerms)}</div>;
      }
      
      let html = part
        .replace(/^#### (.*$)/gim, '<h4 class="font-semibold text-lg !mt-6 !mb-3 text-foreground">$1</h4>')
        .replace(/^### (.*$)/gim, '<h3 class="font-semibold text-xl !mt-8 !mb-4 text-foreground">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="font-semibold text-2xl !mt-10 !mb-4 text-foreground">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="font-bold text-3xl !mt-12 !mb-6 text-foreground">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/90">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="inline-code text-sm font-mono bg-muted/60 dark:bg-muted/40 text-accent-foreground px-1.5 py-0.5 rounded-md">$1</code>')
        .replace(/^\s*[-*] (.*)/gm, '<li>$1</li>')
        .replace(/((<li>.*?<\/li>\s*)+)/gs, '<ul class="list-disc list-inside space-y-1 my-4 text-foreground/90">$1</ul>')
        .replace(/^\s*(\d+)\. (.*)/gm, '<li>$2</li>')
        .replace(/((<li>.*?<\/li>\s*)+)/gs, (match, p1, offset, string) => {
            const listContent = p1;
            const precedingText = string.substring(0, offset);
            if (precedingText.includes('<ol')) {
                return listContent;
            }
            if (listContent.includes('1.')) {
                return `<ol class="list-decimal list-inside space-y-1 my-4 text-foreground/90">${listContent}</ol>`;
            }
            return `<ul class="list-disc list-inside space-y-1 my-4 text-foreground/90">${listContent}</ul>`;
        });
        
      return (
        <motion.div 
            key={`text-${index}`}
            variants={ANIMATION_VARIANTS.item}
            initial="hidden"
            animate="visible"
            className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightSearchTerms(html) }}
        />
      );
    });
  }, [highlightSearchTerms, isDarkMode, renderTable]);

  const renderSolutions = useCallback((content: string) => {
    const sections = content.split('---');
    const solutions = sections.filter(sec => sec.includes('### Solution:'));
    const comparisonTable = sections.find(sec => sec.includes('### Comparison Summary'));

    return (
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="hidden"
        animate="visible"
      >
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {solutions.map((solution, index) => {
            const titleMatch = solution.match(/### Solution: (.*)/);
            const title = titleMatch ? titleMatch[1] : `Solution ${index + 1}`;
            const solutionContent = solution.replace(/### Solution: .*\n/, '');
            
            return (
              <motion.div key={index} variants={ANIMATION_VARIANTS.item}>
                <AccordionItem value={`item-${index}`} className="border rounded-lg mb-4 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-left">{title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="pt-2 border-t border-border/20">
                      {parseMarkdown(solutionContent)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
        
        {comparisonTable && (
          <motion.div className="mt-8" variants={ANIMATION_VARIANTS.item}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Comparison Summary
            </h3>
            {parseMarkdown(comparisonTable)}
          </motion.div>
        )}
      </motion.div>
    );
  }, [parseMarkdown]);

  return (
    <div 
      ref={contentRef}
      className="max-w-none p-6 text-foreground/90 leading-relaxed"
    >
      {activeTab === 'solutions' ? renderSolutions(content) : <div className="prose prose-sm dark:prose-invert max-w-none">{parseMarkdown(content)}</div>}
    </div>
  );
};

const ContentDisplay: FC<Omit<OutputDisplayProps, 'isLoading' | 'className'> & { 
  searchState: SearchState;
  isDarkMode: boolean;
  isFullscreen: boolean;
}> = ({ 
  result, 
  activeTab, 
  targetLanguage, 
  searchState, 
  isDarkMode,
  isFullscreen 
}) => {
  if (!result) return <InitialState />;

  const getContentToDisplay = () => {
    if ('convertedCode' in result) return result.convertedCode;
    if ('explanation' in result) return result.explanation;
    if ('analysis' in result) return result.analysis;
    return "";
  };

  const contentToDisplay = getContentToDisplay();
  const key = `${activeTab}-${JSON.stringify(result)}`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`h-full relative ${isFullscreen ? 'p-4' : ''}`}
      >
        {activeTab === 'convert' && 'convertedCode' in result && result.convertedCode && (
          <div className="h-full relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                {result.convertedCode.split('\n').length} lines
              </Badge>
            </div>
            <SyntaxHighlighter
              language={targetLanguage}
              style={isDarkMode ? oneDark : oneLight}
              customStyle={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                padding: '1rem',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
              wrapLongLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ 
                opacity: 0.6, 
                minWidth: '3em',
                paddingRight: '1em'
              }}
              className="!bg-card/70 h-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
            >
              {result.convertedCode}
            </SyntaxHighlighter>
          </div>
        )}
        
        {(activeTab === 'explain' || activeTab === 'solutions') && (
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <EnhancedMarkdownRenderer
              content={contentToDisplay}
              activeTab={activeTab}
              searchState={searchState}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export const OutputDisplay: FC<OutputDisplayProps> = ({ 
  isLoading, 
  result, 
  activeTab, 
  targetLanguage,
  onRefresh,
  className
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    matches: [],
    currentMatch: 0,
    isSearchOpen: false
  });

  const contentStats = useMemo(() => {
    if (!result) return null;
    
    const content = (() => {
      if ('convertedCode' in result) return result.convertedCode;
      if ('explanation' in result) return result.explanation;
      if ('analysis' in result) return result.analysis;
      return "";
    })();
    
    return {
      characters: content.length,
      words: content.split(/\s+/).filter(Boolean).length,
      lines: content.split('\n').length
    };
  }, [result]);

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const getTitle = () => {
    if (!result && !isLoading) return "Output";
    if (isLoading) return "Processing...";
    
    const icons = {
      explain: <FileText className="h-4 w-4" />,
      solutions: <Lightbulb className="h-4 w-4" />,
      convert: <Code2 className="h-4 w-4" />
    };

    const titles = {
      explain: "Explanation",
      solutions: "Solutions",
      convert: `Converted to ${targetLanguage?.charAt(0).toUpperCase()}${targetLanguage?.slice(1)}`
    };

    return (
      <div className="flex items-center gap-2">
        {icons[activeTab]}
        <span>{titles[activeTab] || "Output"}</span>
      </div>
    );
  };

  const getCopyContent = () => {
    if (!result) return "";
    if ('convertedCode' in result) return result.convertedCode;
    if ('explanation' in result) return result.explanation;
    if ('analysis' in result) return result.analysis;
    return "";
  };

  const handleCopy = useCallback(() => {
    const content = getCopyContent();
    if (content) {
      navigator.clipboard.writeText(content);
      setHasCopied(true);
    }
  }, [result]);

  const handleDownload = useCallback(() => {
    const content = getCopyContent();
    if (!content) return;
    
    const extension = activeTab === 'convert' ? 
      (targetLanguage === 'javascript' ? 'js' : 
       targetLanguage === 'typescript' ? 'ts' : 
       targetLanguage === 'python' ? 'py' : 'txt') : 
      'md';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, activeTab, targetLanguage]);

  const ActionButton: FC<{
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    variant?: 'default' | 'ghost' | 'outline';
    disabled?: boolean;
  }> = ({ icon, tooltip, onClick, variant = 'ghost', disabled = false }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size="icon" 
            onClick={onClick}
            disabled={disabled}
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className={`flex flex-col glassmorphism transition-all duration-300 min-h-[400px] ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative overflow-hidden'
    } ${className}`} style={{ height: isFullscreen ? 'auto' : undefined }}>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/20 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <CardTitle className="text-base font-semibold">{getTitle()}</CardTitle>
          {contentStats && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs px-2 py-1">
                {contentStats.lines} lines
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1">
                {contentStats.words} words
              </Badge>
            </div>
          )}
        </div>
        
        {result && !isLoading && (
          <div className="flex items-center gap-1">
            <ActionButton
              icon={<Download className="h-4 w-4" />}
              tooltip="Download"
              onClick={handleDownload}
            />
            
            <ActionButton
              icon={hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              tooltip={hasCopied ? "Copied!" : "Copy"}
              onClick={handleCopy}
            />
            
            {onRefresh && (
              <ActionButton
                icon={<RefreshCw className="h-4 w-4" />}
                tooltip="Refresh"
                onClick={onRefresh}
              />
            )}
            
            <ActionButton
              icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              tooltip={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              onClick={() => setIsFullscreen(!isFullscreen)}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-0 relative">
        {isLoading ? (
          <LoadingState />
        ) : (
          <ContentDisplay
            result={result}
            activeTab={activeTab}
            targetLanguage={targetLanguage}
            searchState={searchState}
            isDarkMode={isDarkMode}
            isFullscreen={isFullscreen}
          />
        )}
      </CardContent>
    </Card>
  );
};
