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
    prompt: `You are an expert pharmacist with OCR capabilities and simulated web access. Your task is to analyze the provided image of a medicine or supplement package with absolute precision.

Your process must be as follows:
1.  **Extract Brand Name**: Carefully analyze the image to identify the most prominent text on the package. This is the **brandName**. If no clear brand name is visible, you may omit it.
2.  **Simulated Web Search for Ingredients**: You MUST perform a simulated web search for the extracted brand name to find a comprehensive list of its active ingredients. Do not rely solely on the image for the ingredient list, as it might be incomplete or in a different language.
3.  **Identify Active Ingredients**: List ALL active ingredients found in your search results. Be precise. For example, if you find "Curcumin" and "Piperine", you must list both in the **activeIngredients** array.
4.  **Determine Category**: Based on the active ingredients, classify the product into a primary **category** (e.g., "Pain Reliever", "Antibiotic", "Dietary Supplement", "Anti-inflammatory").
5.  **Generate Tags**: Create 3-5 relevant **tags** that describe the product's function or components (e.g., "Anti-inflammatory", "Fever reducer", "Joint Health").

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

    // Fallback logic: If after all that, activeIngredients is still empty, but we have a brand name,
    // use the brand name as the ingredient. This prevents a total failure.
    if (!output.activeIngredients || output.activeIngredients.length === 0) {
        if (!output.brandName) {
            throw new Error('AI could not identify any brand name or active ingredients.');
        }
        // As a last resort, use the brand name itself as the ingredient.
        output.activeIngredients = [output.brandName];
    }

    return output;
  }
);
