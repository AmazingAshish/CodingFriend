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
  complexityAnalysis: z.string().describe('An analysis of the code complexity.'),
  vulnerabilityAnalysis: z.string().describe('An analysis of potential vulnerabilities in the code.'),
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
Code: {{{code}}}

Provide a detailed complexity analysis and a vulnerability assessment.
Complexity Analysis:

Vulnerability Analysis:
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
    return output!;
  }
);
