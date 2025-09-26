'use server';
/**
 * @fileOverview Generates an analysis of a drug's interactions.
 *
 * - getDrugInteraction - A function that returns potential drug interactions and usage advice.
 * - GetDrugInteractionInput - The input type for the function.
 * - GetDrugInteractionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetDrugInteractionInputSchema = z.object({
  drugName: z.string().describe('The name of the primary drug to analyze.'),
  userDrugs: z.array(z.string()).describe('A list of other drug names in the user\'s pharmacy to check for interactions against.'),
});
export type GetDrugInteractionInput = z.infer<typeof GetDrugInteractionInputSchema>;

const GetDrugInteractionOutputSchema = z.object({
  interactionsWithUserDrugs: z.string().describe('A summary of potential interactions with the other drugs in the user\'s list, in Persian. If none, state that clearly.'),
  generalInteractions: z.string().describe('A summary of common interactions with substances like food, alcohol, or other supplements, in Persian.'),
  usageAdvice: z.string().describe('Advice on the best time and way to take the medication (e.g., with food, in the morning), in Persian.'),
});
export type GetDrugInteractionOutput = z.infer<typeof GetDrugInteractionOutputSchema>;

export async function getDrugInteraction(input: GetDrugInteractionInput): Promise<GetDrugInteractionOutput> {
  return getDrugInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDrugInteractionPrompt',
  input: {schema: GetDrugInteractionInputSchema},
  output: {schema: GetDrugInteractionOutputSchema},
  prompt: `You are an expert pharmacist. Your responses MUST be in PERSIAN.

  Analyze the drug "{{{drugName}}}" based on the following context.

  Other drugs in the user's pharmacy: {{#each userDrugs}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Your Task (in Persian):
  1.  **Interactions With User Drugs**: Check for potential interactions between "{{{drugName}}}" and the other drugs in the user's pharmacy list. If there are potential interactions, describe them simply. If there are no obvious interactions, state "تداخل قابل توجهی با سایر داروهای شما یافت نشد."
  2.  **General Interactions**: Describe common interactions for "{{{drugName}}}" with general substances like certain foods, alcohol, or common supplements.
  3.  **Usage Advice**: Provide clear advice on the best time of day and method for taking this medication (e.g., "بهتر است صبح‌ها همراه با غذا مصرف شود تا از ناراحتی معده جلوگیری شود.").
  4.  ALWAYS include this exact disclaimer in Persian at the end of EACH field: "این یک توصیه پزشکی نیست و باید با پزشک یا داروساز مشورت شود."

  Provide ONLY the requested JSON object.`,
});

const getDrugInteractionFlow = ai.defineFlow(
  {
    name: 'getDrugInteractionFlow',
    inputSchema: GetDrugInteractionInputSchema,
    outputSchema: GetDrugInteractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
