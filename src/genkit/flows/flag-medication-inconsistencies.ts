'use server';

/**
 * @fileOverview This flow is designed to flag inconsistencies or misclassifications of medications.
 *
 * - flagMedicationInconsistencies - A function that triggers the medication inconsistency flagging process.
 * - FlagMedicationInconsistenciesInput - The input type for the flagMedicationInconsistencies function.
 * - FlagMedicationInconsistenciesOutput - The return type for the flagMedicationInconsistencies function.
 */

import {ai} from '@/genkit';
import {z} from 'genkit';

const FlagMedicationInconsistenciesInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to check.'),
  drugCategory: z.string().describe('The category the drug is currently assigned to.'),
  drugTags: z.array(z.string()).describe('An array of tags associated with the drug.'),
  description: z.string().describe('The description of the drug.'),
});

export type FlagMedicationInconsistenciesInput = z.infer<typeof FlagMedicationInconsistenciesInputSchema>;

const FlagMedicationInconsistenciesOutputSchema = z.object({
  isConsistent: z.boolean().describe('Whether the drug information is consistent.'),
  flagReason: z.string().optional().describe('If not consistent, the reason for flagging.'),
});

export type FlagMedicationInconsistenciesOutput = z.infer<typeof FlagMedicationInconsistenciesOutputSchema>;

export async function flagMedicationInconsistencies(
  input: FlagMedicationInconsistenciesInput
): Promise<FlagMedicationInconsistenciesOutput> {
  return flagMedicationInconsistenciesFlow(input);
}

const flagMedicationInconsistenciesPrompt = ai.definePrompt({
  name: 'flagMedicationInconsistenciesPrompt',
  input: {schema: FlagMedicationInconsistenciesInputSchema},
  output: {schema: FlagMedicationInconsistenciesOutputSchema},
  prompt: `You are an expert in pharmacology and drug classification.

  Your task is to determine if the provided information about a drug is consistent.
  Consider the drug's name, category, tags, and description.

  Drug Name: {{{drugName}}}
  Drug Category: {{{drugCategory}}}
  Drug Tags: {{#each drugTags}}{{{this}}}, {{/each}}
  Description: {{{description}}}

  Determine if the provided information is consistent. If not, explain why the information is inconsistent, and set isConsistent to false. Otherwise, set isConsistent to true.
  `,
});

const flagMedicationInconsistenciesFlow = ai.defineFlow(
  {
    name: 'flagMedicationInconsistenciesFlow',
    inputSchema: FlagMedicationInconsistenciesInputSchema,
    outputSchema: FlagMedicationInconsistenciesOutputSchema,
  },
  async input => {
    const {output} = await flagMedicationInconsistenciesPrompt(input);
    return output!;
  }
);
