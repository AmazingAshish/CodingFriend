'use server';
/**
 * @fileOverview An AI agent that explains code snippets in simple terms.
 *
 * - explainCode - A function that handles the code explanation process.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to be explained.'),
  language: z.string().optional().describe('The programming language of the code.'),
  isEli5: z.boolean().optional().describe('Whether to explain the code in "Explain Like I\'m 5" mode.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('A simple explanation of the code snippet in Markdown format.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert coding tutor. Your goal is to explain a code snippet in a clear, structured, and easy-to-understand way using Markdown.

{{#if isEli5}}
Explain the following code snippet in extremely simple terms, as if you were explaining it to a 5-year-old child. Use analogies and avoid technical jargon.
{{else}}
Explain the following code snippet by breaking it down into sections. Use headings, bullet points, and numbered lists for clarity.
{{/if}}

Code ({{language}}):
\`\`\`{{language}}
{{{code}}}
\`\`\`

Please structure your explanation in Markdown like this:

### 🎯 Goal
A one-sentence summary of what the code is trying to achieve.

### 🧠 Approach
A brief overview of the method or algorithm used.

### 📝 Step-by-Step Walkthrough
1.  **Step 1:** Explain the first part of the code.
2.  **Step 2:** Explain the next part.
3.  ...continue for all logical steps.

### ✨ Key Takeaways
- Highlight the most important concepts or tricks used in the code.
- Provide tips for similar problems.
`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
