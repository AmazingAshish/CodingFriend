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
  maxSolutions: z.number().int().min(2).max(5).default(3).optional(),
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
    // A simple regex to find keywords, avoiding matches inside strings or comments is complex
    // This is a basic approximation
    return count + (code.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
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

First, provide at least two, and up to a maximum of {{maxSolutions}}, alternative solutions. For each solution, provide the following structure, separating each complete solution with a \`---\` horizontal rule.

### Solution: [Approach Name, e.g., Brute-Force]
#### Algorithm
Explain the step-by-step logic of the solution using a numbered list. Do not use a bullet point for the "Algorithm" title itself.

#### Code
Provide the complete code for this solution in a markdown code block. Do not use a bullet point for the "Code" title itself.

#### Complexity Analysis
- **Time Complexity**: State the Big O time complexity (e.g., \`O(n^2)\`) and explain why.
- **Space Complexity**: State the Big O space complexity (e.g., \`O(n)\`) and explain why.

---

After providing the solutions, create a "Comparison Summary" section. This section must contain a Markdown table that compares all the solutions you provided. The table should have the columns: "Approach", "Time Complexity", and "Space Complexity".

### Comparison Summary
| Approach                | Time Complexity | Space Complexity |
| ----------------------- | --------------- | ---------------- |
| [Solution 1 Name]       | \`O(...)\`      | \`O(...)\`         |
| [Solution 2 Name]       | \`O(...)\`      | \`O(...)\`         |

Ensure the entire response is a single, clean markdown string.
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
  async input => {
    const {output} = await analyzeCodePrompt(input);
    return { analysis: output!.analysis };
  }
);
