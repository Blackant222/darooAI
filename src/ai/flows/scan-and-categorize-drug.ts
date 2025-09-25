'use server';
/**
 * @fileOverview Scans a medicine label, identifies the drug's brand name and active ingredients, categorizes it, and extracts relevant tags.
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
  brandName: z.string().optional().describe('The brand name of the drug, if available.'),
  activeIngredients: z.array(z.string()).describe('A list of one or more active ingredients (generic names).'),
  category: z.string().describe('The primary category of the drug (e.g., "Pain Reliever", "Antibiotic", "Dietary Supplement").'),
  tags: z.array(z.string()).describe('A list of 3-5 relevant tags for the drug.'),
});
export type ScanAndCategorizeDrugOutput = z.infer<typeof ScanAndCategorizeDrugOutputSchema>;

export async function scanAndCategorizeDrug(input: ScanAndCategorizeDrugInput): Promise<ScanAndCategorizeDrugOutput> {
  return scanAndCategorizeDrugFlow(input);
}


const scanAndCategorizeDrugPrompt = ai.definePrompt({
    name: 'scanAndCategorizeDrugPrompt',
    input: { schema: ScanAndCategorizeDrugInputSchema },
    output: { schema: ScanAndCategorizeDrugOutputSchema },
    prompt: `You are an expert pharmacist. Analyze the provided image of a medicine package. You must simulate performing a web search if you do not recognize the drug.

Your tasks are:
1.  From the image, identify the most prominent name on the package. This is the **brandName**. If no brand name is clear, you can omit it.
2.  Identify all active ingredients in the drug. This may require you to "search" for the brand name to find its components. List them in the **activeIngredients** array.
3.  Determine the drug's primary **category** (e.g., "Pain Reliever", "Antibiotic", "Dietary Supplement").
4.  Generate 3-5 relevant **tags** (e.g., "Anti-inflammatory", "Fever reducer").

Return ONLY a valid JSON object with the keys "brandName", "activeIngredients", "category", and "tags".

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

    // Ensure activeIngredients is not empty
    if (!output.activeIngredients || output.activeIngredients.length === 0) {
        // If brandName is also missing, it's a total failure
        if (!output.brandName) {
            throw new Error('AI could not identify any brand name or active ingredients.');
        }
        // If we have a brand name, use it as the ingredient as a fallback
        output.activeIngredients = [output.brandName];
    }

    return output;
  }
);
