'use server';
/**
 * @fileOverview Provides code language detection functionalities.
 *
 * - detectLanguage - Identifies the programming language of a code snippet.
 * - DetectLanguageInput - The input type for the detectLanguage function.
 * - DetectLanguageOutput - The return type for the detectLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLanguageInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze for language detection.'),
});
export type DetectLanguageInput = z.infer<typeof DetectLanguageInputSchema>;

const DetectLanguageOutputSchema = z.object({
  language: z.string().describe('The detected programming language (e.g., "javascript", "python").'),
});
export type DetectLanguageOutput = z.infer<typeof DetectLanguageOutputSchema>;

export async function detectLanguage(input: DetectLanguageInput): Promise<DetectLanguageOutput> {
  return detectLanguageFlow(input);
}

const detectLanguagePrompt = ai.definePrompt({
  name: 'detectLanguagePrompt',
  input: {schema: DetectLanguageInputSchema},
  output: {schema: DetectLanguageOutputSchema},
  prompt: `You are an expert at detecting programming languages. Analyze the following code snippet and identify its programming language.

Return only the lowercase name of the language (e.g., "javascript", "python", "go").

Code:
\`\`\`
{{{code}}}
\`\`\`
`,
});

const detectLanguageFlow = ai.defineFlow(
  {
    name: 'detectLanguageFlow',
    inputSchema: DetectLanguageInputSchema,
    outputSchema: DetectLanguageOutputSchema,
  },
  async input => {
    // If the code is very short, it's hard to detect, return empty
    if (input.code.trim().length < 10) {
      return { language: '' };
    }
    const {output} = await detectLanguagePrompt(input);
    return output!;
  }
);
