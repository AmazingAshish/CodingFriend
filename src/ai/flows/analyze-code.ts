'use server';
/**
 * @fileOverview Provides code analysis functionalities including generating multiple solutions.
 *
 * - analyzeCode - Generates multiple algorithmic solutions for a given code problem.
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
  analysis: z.string().describe('A detailed analysis of the code in Markdown format, providing multiple solutions.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are an expert programmer and algorithm designer. Your task is to analyze the following code snippet and provide multiple alternative solutions.

For the given code, provide at least two alternative solutions: a brute-force approach and a more optimal solution.

Language: {{language}}
Code:
\`\`\`{{language}}
{{{code}}}
\`\`\`

For each solution, provide the following in a clear, structured Markdown format:

### Solution 1: Brute-Force Approach
- **Algorithm**: Explain the step-by-step logic of the brute-force solution.
- **Code**: Provide the complete code for this solution in a markdown code block.
- **Complexity Analysis**:
  - **Time Complexity**: State the Big O time complexity and explain why.
  - **Space Complexity**: State the Big O space complexity and explain why.

### Solution 2: Optimal Solution
- **Algorithm**: Explain the step-by-step logic of the optimal solution (e.g., using dynamic programming, a greedy approach, two pointers, etc.).
- **Code**: Provide the complete code for the optimal solution in a markdown code block.
- **Complexity Analysis**:
  - **Time Complexity**: State the Big O time complexity and explain why it's more efficient.
  - **Space Complexity**: State the Big O space complexity and explain why.

If applicable, provide a third, even more optimized or different approach. Ensure the entire response is a single markdown string.
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
