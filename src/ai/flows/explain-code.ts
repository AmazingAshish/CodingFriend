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
  prompt: `You are an expert code analyst and programming tutor. Your goal is to explain and analyze a code snippet in a clear, professional, and highly structured way using Markdown.

{{#if isEli5}}
Explain the following code snippet in extremely simple terms, as if you were explaining it to a 5-year-old child. Use analogies and avoid technical jargon.
Code ({{language}}):
\`\`\`{{language}}
{{{code}}}
\`\`\`
Structure your explanation in Markdown with clear sections, like "What it Does" and "A Simple Story".
{{else}}
Provide a professional analysis of the following code snippet. The response must be well-structured, easy to read, and use Markdown for formatting.

Code ({{language}}):
\`\`\`{{language}}
{{{code}}}
\`\`\`

Please structure your response in Markdown like this:

### 🎯 Goal
A concise, one-sentence summary of the code's primary objective.

---

### 🧠 Logic Walkthrough
A brief overview of the algorithm or method used, followed by a detailed, numbered step-by-step breakdown of the code's execution flow.
1.  **Step 1:** Explain the first logical block of the code.
2.  **Step 2:** Explain the next part.
3.  ...continue for all logical steps, ensuring clarity.

---

### Complexity Analysis
-   **Time Complexity**: Analyze the time complexity (e.g., \`O(n log n)\`) and provide a clear justification.
-   **Space Complexity**: Analyze the space complexity (e.g., \`O(1)\`) and provide a clear justification.

---

### 🛡️ Vulnerabilities & Best Practices
-   Identify any potential security vulnerabilities, performance bottlenecks, or areas where the code deviates from best practices.
-   Suggest specific, actionable improvements or fixes with code examples where applicable.

---

### ✨ Key Takeaways
-   Highlight the most important programming concepts, data structures, or algorithmic tricks used in the code.
-   Provide actionable tips for solving similar problems in the future.
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
