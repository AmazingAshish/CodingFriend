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
  analysis: z.string().describe('A detailed analysis of the code in Markdown format, providing multiple solutions and a comparison table.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are an expert programmer and algorithm designer. Your task is to analyze the following code snippet and provide multiple alternative solutions in a professional and structured Markdown format.

Language: {{language}}
Code:
\`\`\`{{language}}
{{{code}}}
\`\`\`

First, provide at least two alternative solutions. For each solution, provide the following structure. Separate each complete solution with a \`---\` horizontal rule.

### Solution: [Approach Name, e.g., Brute-Force]
- **Algorithm**: Explain the step-by-step logic of the solution using a numbered list.
- **Code**: Provide the complete code for this solution in a markdown code block.
- **Complexity Analysis**:
  - **Time Complexity**: State the Big O time complexity (e.g., \`O(n^2)\`) and explain why.
  - **Space Complexity**: State the Big O space complexity (e.g., \`O(n)\`) and explain why.

---

### Solution: [Approach Name, e.g., Optimal Solution]
- **Algorithm**: Explain the step-by-step logic of the optimal solution (e.g., using dynamic programming, a greedy approach, two pointers, etc.) using a numbered list.
- **Code**: Provide the complete code for the optimal solution in a markdown code block.
- **Complexity Analysis**:
  - **Time Complexity**: State the Big O time complexity and explain why it's more efficient.
  - **Space Complexity**: State the Big O space complexity and explain why.

---

After providing the solutions, create a "Comparison Summary" section. This section must contain a Markdown table that compares all the solutions you provided. The table should have the columns: "Approach", "Time Complexity", and "Space Complexity".

Example of the final table structure:

### Comparison Summary
| Approach                | Time Complexity | Space Complexity |
| ----------------------- | --------------- | ---------------- |
| Brute-Force             | \`O(n^2)\`      | \`O(1)\`         |
| Optimal (Hash Map)      | \`O(n)\`        | \`O(n)\`         |

Ensure the entire response is a single, clean markdown string.
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
