'use server';
/**
 * @fileOverview Provides comprehensive code analysis functionalities.
 * 
 * - analyzeCode - Generates multiple algorithmic solutions and a detailed analysis for a given code problem.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  language: z.string().optional().describe('The programming language of the code snippet.'),
  maxSolutions: z.number().int().min(3).max(5).default(5).optional(), // Changed default to 5
});

export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the code in Markdown format, providing multiple solutions and a comparison table.'),
});

export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

// Utility function to calculate simple code metrics
function calculateCodeMetrics(code: string) {
  const lines = code.split('\n').filter(line => line.trim().length > 0);
  const linesOfCode = lines.length;
  
  // Simple cyclomatic complexity estimation
  const complexityKeywords = ['if', 'else', 'for', 'while', 'case', 'catch', '&&', '||', '?'];
  const cyclomaticComplexity = complexityKeywords.reduce((count, keyword) => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'g');
    return count + (code.match(regex) || []).length;
  }, 1);
  
  return {
    linesOfCode,
    cyclomaticComplexity,
  };
}

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  const validatedInput = AnalyzeCodeInputSchema.parse(input);
  const metrics = calculateCodeMetrics(validatedInput.code);
  
  return analyzeCodeFlow({
    ...validatedInput,
    metrics
  });
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'enhancedAnalyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema.extend({
    metrics: z.object({
      linesOfCode: z.number(),
      cyclomaticComplexity: z.number(),
    })
  })},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are an expert software architect and algorithm designer. Your task is to provide a comprehensive analysis of the following code snippet in a professional, structured Markdown format.

**Code Details:**
- **Language**: {{language}}
- **Lines of Code**: {{metrics.linesOfCode}}
- **Estimated Cyclomatic Complexity**: {{metrics.cyclomaticComplexity}}

**Code to Analyze:**
\`\`\`{{language}}
{{{code}}}
\`\`\`

---

**IMPORTANT FORMATTING REQUIREMENTS:**
1. You MUST provide EXACTLY {{maxSolutions}} different solutions.
2. Each solution heading MUST include a descriptive tagline in parentheses, like (Brute-force), (Better), or (Optimal).
3. Each solution must be separated by a \`---\` horizontal rule.
4. After all solutions, you MUST include a "Comparison Summary" section with a single, properly formatted markdown table.

**First, provide exactly {{maxSolutions}} alternative solutions. For each solution, provide the following structure:**

### Solution: [Approach Name] (Tagline)

#### Algorithm
Explain the step-by-step logic of the solution using a numbered list.

#### Code
Provide the complete code for this solution in a markdown code block.

#### Complexity Analysis
- **Time Complexity**: State the Big O time complexity (e.g., \`O(n^2)\`) and explain why.
- **Space Complexity**: State the Big O space complexity (e.g., \`O(n)\`) and explain why.

---
**(Repeat for all solutions)**
---

**After providing all solutions, create the final "Comparison Summary" section.**

### Comparison Summary

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| [Solution 1 Name] | \`O(...)\`      | \`O(...)\`       |
| [Solution 2 Name] | \`O(...)\`      | \`O(...)\`       |
| [Solution 3 Name] | \`O(...)\`      | \`O(...)\`       |
| [Solution 4 Name] | \`O(...)\`      | \`O(...)\`       |
| [Solution 5 Name] | \`O(...)\`      | \`O(...)\`       |

**CRITICAL REQUIREMENTS:**
- The "Comparison Summary" section must appear ONLY ONCE, at the very end.
- The summary must contain ONLY the table. Do not add any text before or after the table in this section.
- The table must have exactly {{maxSolutions}} data rows.
- Use proper markdown table syntax. Wrap complexity notations in backticks.

Ensure the entire response is a single, clean markdown string with consistent formatting.
`,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema.extend({
      metrics: z.object({
        linesOfCode: z.number(),
        cyclomaticComplexity: z.number(),
      })
    }),
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeCodePrompt(input);
    
    // Post-process the output to ensure consistent table formatting
    let processedAnalysis = output!.analysis;
    
    // Fix common table formatting issues
    processedAnalysis = processedAnalysis.replace(/\|\s*\|\s*\|/g, '|---|---|'); // Fix empty separator rows
    processedAnalysis = processedAnalysis.replace(/\|(\s*-+\s*)\|/g, '|$1|'); // Ensure separator rows are properly formatted
    
    // Ensure comparison table is properly formatted
    const tableRegex = /### Comparison Summary\s*\n\s*\n?\s*\|.*?\|\s*\n\s*\|.*?\|\s*\n((?:\s*\|.*?\|\s*\n)*)/gm;
    processedAnalysis = processedAnalysis.replace(tableRegex, (match, tableRows) => {
      // Reconstruct the table with proper formatting
      const lines = match.split('\n').filter(line => line.trim());
      const header = lines.find(line => line.includes('Approach') && line.includes('Time Complexity'));
      const separator = '|----------|----------------|------------------|';
      const dataRows = lines.filter(line => 
        line.includes('|') && 
        !line.includes('Approach') && 
        !line.includes('---') &&
        line.trim().length > 0
      );
      
      if (header && dataRows.length > 0) {
        return `### Comparison Summary\n\n${header}\n${separator}\n${dataRows.join('\n')}\n`;
      }
      return match;
    });
    
    return {
      analysis: processedAnalysis
    };
  }
);
