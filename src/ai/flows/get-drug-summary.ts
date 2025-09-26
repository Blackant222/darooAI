'use server';
/**
 * @fileOverview Generates a summary and side effects for a given drug.
 *
 * - getDrugSummary - A function that returns an AI-generated summary and side effects.
 * - GetDrugSummaryInput - The input type for the getDrugSummary function.
 * - GetDrugSummaryOutput - The return type for the getDrugSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetDrugSummaryInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to summarize.'),
});
export type GetDrugSummaryInput = z.infer<typeof GetDrugSummaryInputSchema>;

const GetDrugSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief, easy-to-understand summary of what the drug is used for, in Persian.'),
  sideEffects: z.string().describe('A list of common side effects, presented as a single string with bullet points, in Persian.'),
});
export type GetDrugSummaryOutput = z.infer<typeof GetDrugSummaryOutputSchema>;

export async function getDrugSummary(input: GetDrugSummaryInput): Promise<GetDrugSummaryOutput> {
  return getDrugSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDrugSummaryPrompt',
  input: {schema: GetDrugSummaryInputSchema},
  output: {schema: GetDrugSummaryOutputSchema},
  prompt: `You are an expert pharmacist providing information to a layperson. Your responses MUST be in PERSIAN.

  For the drug named "{{{drugName}}}":
  1.  **Summary**: Write a brief, one or two-sentence summary explaining what this drug is typically used for in simple, clear language.
  2.  **Side Effects**: List 3-5 of the most common side effects. Format this as a single string with each side effect prefixed by a bullet point (e.g., "• سردرد\n• حالت تهوع\n• ...").

  Provide ONLY the requested JSON object.`,
});

const getDrugSummaryFlow = ai.defineFlow(
  {
    name: 'getDrugSummaryFlow',
    inputSchema: GetDrugSummaryInputSchema,
    outputSchema: GetDrugSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
