'use server';
/**
 * @fileOverview Provides code analysis functionalities including complexity and vulnerability assessments.
 *
 * - analyzeCode - Analyzes code for complexity and vulnerabilities.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  language: z.string().optional().describe('The programming language of the code snippet.'),
});
export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the code in Markdown format.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are an expert code analyst. Analyze the following code snippet for complexity and potential vulnerabilities.

Language: {{language}}
Code:
\`\`\`{{language}}
{{{code}}}
\`\`\`

Provide the analysis in a structured Markdown format. Use headings, bullet points, and code blocks for clarity.

Structure your response like this:
### Complexity Analysis
- **Time Complexity**: Analyze the time complexity (Big O notation) and explain why.
- **Space Complexity**: Analyze the space complexity (Big O notation) and explain why.

### Vulnerability Analysis
- Identify potential security vulnerabilities (e.g., buffer overflows, injection attacks, etc.).
- Suggest specific fixes or best practices to mitigate the risks.

### Refactoring Suggestions
- Provide suggestions for improving code quality, readability, and performance.
- Include small code snippets to illustrate your suggestions where applicable.
`,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await analyzeCodePrompt(input);
    return { analysis: output!.analysis };
  }
);
