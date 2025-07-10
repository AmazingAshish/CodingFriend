'use server';
/**
 * @fileOverview Provides code conversion functionalities.
 *
 * - convertCode - Converts code from one language to another.
 * - ConvertCodeInput - The input type for the convertCode function.
 * - ConvertCodeOutput - The return type for the convertCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to convert.'),
  sourceLanguage: z.string().describe('The source programming language of the code.'),
  targetLanguage: z.string().describe('The target programming language to convert the code to.'),
});
export type ConvertCodeInput = z.infer<typeof ConvertCodeInputSchema>;

const ConvertCodeOutputSchema = z.object({
  convertedCode: z.string().describe('The resulting converted code.'),
});
export type ConvertCodeOutput = z.infer<typeof ConvertCodeOutputSchema>;

export async function convertCode(input: ConvertCodeInput): Promise<ConvertCodeOutput> {
  return convertCodeFlow(input);
}

const convertCodePrompt = ai.definePrompt({
  name: 'convertCodePrompt',
  input: {schema: ConvertCodeInputSchema},
  output: {schema: ConvertCodeOutputSchema},
  prompt: `You are an expert programmer and code converter. Your task is to convert the following code snippet from {{sourceLanguage}} to {{targetLanguage}}.

Follow these rules:
1.  **Direct Conversion**: Translate the logic and structure as accurately as possible.
2.  **No Extra Content**: Provide ONLY the raw converted code. Do not include any explanations, markdown formatting (like \`\`\`{{targetLanguage}}\`), or any text other than the code itself.
3.  **Idiomatic Code**: Ensure the output uses standard conventions and best practices for the target language.

Original Code ({{sourceLanguage}}):
\`\`\`{{sourceLanguage}}
{{{code}}}
\`\`\`
`,
});

const convertCodeFlow = ai.defineFlow(
  {
    name: 'convertCodeFlow',
    inputSchema: ConvertCodeInputSchema,
    outputSchema: ConvertCodeOutputSchema,
  },
  async input => {
    const {output} = await convertCodePrompt(input);
    return output!;
  }
);
