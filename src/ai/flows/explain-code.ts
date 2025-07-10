'use server';
/**
 * @fileOverview An AI agent that explains code snippets and analyzes them.
 *
 * - explainCode - A function that handles the code explanation and analysis process.
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
  explanation: z.string().describe('A simple explanation and analysis of the code snippet in Markdown format.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert code analyst and tutor. Your goal is to explain and analyze a code snippet in a clear, structured, and easy-to-understand way using Markdown.

{{#if isEli5}}
Explain the following code snippet in extremely simple terms, as if you were explaining it to a 5-year-old child. Use analogies and avoid technical jargon.
Code ({{language}}):
\`\`\`{{language}}
{{{code}}}
\`\`\`
Structure your explanation in Markdown with a "Goal" and a "Simple Story" section.
{{else}}
Analyze the following code snippet for its purpose, complexity, and potential vulnerabilities.

Code ({{language}}):
\`\`\`{{language}}
{{{code}}}
\`\`\`

Please structure your response in Markdown like this:

### 🎯 Goal
A one-sentence summary of what the code is trying to achieve.

### 🧠 Logic Walkthrough
A brief overview of the method or algorithm used, followed by a step-by-step breakdown.
1.  **Step 1:** Explain the first part of the code.
2.  **Step 2:** Explain the next part.
3.  ...continue for all logical steps.

### Complexity Analysis
- **Time Complexity**: Analyze the time complexity (Big O notation) and explain why.
- **Space Complexity**: Analyze the space complexity (Big O notation) and explain why.

### Vulnerability & Best Practices
- Identify potential security vulnerabilities or areas where the code doesn't follow best practices.
- Suggest specific fixes or improvements.

### ✨ Key Takeaways
- Highlight the most important concepts or tricks used in the code.
- Provide tips for similar problems.
{{/if}}
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
