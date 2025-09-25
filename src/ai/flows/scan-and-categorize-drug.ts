'use server';
/**
 * @fileOverview Scans a medicine label, identifies the drug, categorizes it, and extracts relevant tags.
 *
 * - scanAndCategorizeDrug - A function that handles the drug scanning and categorization process.
 * - ScanAndCategorizeDrugInput - The input type for the scanAndCategorizeDrug function.
 * - ScanAndCategorizeDrugOutput - The return type for the scanAndCategorizeDrug function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanAndCategorizeDrugInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanAndCategorizeDrugInput = z.infer<typeof ScanAndCategorizeDrugInputSchema>;

const ScanAndCategorizeDrugOutputSchema = z.object({
  drugName: z.string().describe('The name of the identified drug.'),
  category: z.string().describe('The category of the drug.'),
  tags: z.array(z.string()).describe('Relevant tags for the drug.'),
});
export type ScanAndCategorizeDrugOutput = z.infer<typeof ScanAndCategorizeDrugOutputSchema>;

export async function scanAndCategorizeDrug(input: ScanAndCategorizeDrugInput): Promise<ScanAndCategorizeDrugOutput> {
  return scanAndCategorizeDrugFlow(input);
}


const scanAndCategorizeDrugPrompt = ai.definePrompt({
    name: 'scanAndCategorizeDrugPrompt',
    input: { schema: ScanAndCategorizeDrugInputSchema },
    output: { schema: ScanAndCategorizeDrugOutputSchema },
    prompt: `You are an expert pharmacist. Analyze the provided image of a medicine package.
      
Your tasks are:
1. Identify the most prominent name on the package. This could be a brand name or a generic name.
2. Determine the official generic drug name. If the name is a brand name (like 'Advil'), find its active ingredient (like 'Ibuprofen'). If it's a supplement, use the supplement's primary ingredient name.
3. Determine the drug's primary category (e.g., "Pain Reliever", "Antibiotic", "Dietary Supplement").
4. Generate 3-5 relevant tags (e.g., "Anti-inflammatory", "Fever reducer").

Return ONLY a valid JSON object with the keys "drugName", "category", and "tags".

Image: {{media url=photoDataUri}}`
});


const scanAndCategorizeDrugFlow = ai.defineFlow(
  {
    name: 'scanAndCategorizeDrugFlow',
    inputSchema: ScanAndCategorizeDrugInputSchema,
    outputSchema: ScanAndCategorizeDrugOutputSchema,
  },
  async (input) => {
    const { output } = await scanAndCategorizeDrugPrompt(input);
    
    if (!output) {
        throw new Error('The AI failed to return a valid structured response.');
    }

    return output;
  }
);
