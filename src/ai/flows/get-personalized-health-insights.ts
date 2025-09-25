// src/ai/flows/get-personalized-health-insights.ts
'use server';
/**
 * @fileOverview Provides personalized medication recommendations and drug interaction alerts based on user health conditions.
 *
 * - getPersonalizedHealthInsights - A function that returns personalized medication recommendations and drug interaction alerts.
 * - PersonalizedHealthInsightsInput - The input type for the getPersonalizedHealthInsights function.
 * - PersonalizedHealthInsightsOutput - The return type for the getPersonalizedHealthInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHealthInsightsInputSchema = z.object({
  healthConditions: z
    .string()
    .describe('A comma-separated list of the user health conditions.'),
  medications: z.string().describe('A comma-separated list of current medications.'),
});
export type PersonalizedHealthInsightsInput = z.infer<typeof PersonalizedHealthInsightsInputSchema>;

const PersonalizedHealthInsightsOutputSchema = z.object({
  recommendations: z.string().describe('Personalized medication recommendations.'),
  interactionAlerts: z.string().describe('Drug interaction alerts.'),
});
export type PersonalizedHealthInsightsOutput = z.infer<typeof PersonalizedHealthInsightsOutputSchema>;

export async function getPersonalizedHealthInsights(
  input: PersonalizedHealthInsightsInput
): Promise<PersonalizedHealthInsightsOutput> {
  return getPersonalizedHealthInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHealthInsightsPrompt',
  input: {schema: PersonalizedHealthInsightsInputSchema},
  output: {schema: PersonalizedHealthInsightsOutputSchema},
  prompt: `You are a clinical pharmacist providing personalized medication recommendations and drug interaction alerts based on user health conditions and current medications.

  Health Conditions: {{{healthConditions}}}
  Current Medications: {{{medications}}}

  Provide medication recommendations and highlight any potential drug interactions. Be concise and clear.`,
});

const getPersonalizedHealthInsightsFlow = ai.defineFlow(
  {
    name: 'getPersonalizedHealthInsightsFlow',
    inputSchema: PersonalizedHealthInsightsInputSchema,
    outputSchema: PersonalizedHealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
